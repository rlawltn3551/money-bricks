from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import openai
import requests

from langchain_openai import ChatOpenAI
from db import get_all_data_in_tables, show_data

# DB의 질의응답을 위한 Agent
from langchain.agents.agent_types import AgentType
from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

# pip install tabulate
from tabulate import tabulate
import pandas as pd

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = ""

# Langchain 질문 분석을 위한 프롬프트 생성
URL_PROMPT = PromptTemplate(
    input_variables=["question"],
    template="""
    사용자의 질문을 이해하고, 적절한 링크를 추천해 줘.

    질문: "{question}"

    만약 질문이 '포인트 내역 조회', '포인트 확인'과 관련되어 있다면,
    'http://localhost:3000/mypage/point-history/list' 링크를 추천해 줘.

    만약 질문이 '입금 내역 조회', '입금 기록'과 관련되어 있다면,
    'http://localhost:3000/mypage/deposit-history/current/list' 링크를 추천해 줘.
    
    만약 질문이 '계좌 조회', '계좌 변경', '포인트 입금', '개인정보수정', '비밀번호 변경'과 관련되어 있다면,
    'http://localhost:3000/mypage/account' 링크를 추천해 줘.

    만약 관련된 링크가 없다면, 'N/A'로 답변해 줘.
    """
)

# DB의 데이터를 필터링, 계산, 추천하는 함수
# langchain 의 pandas 관련 agent 를 통해 성능 개선
@app.route('/info', methods=['POST'])
def info():
    user_input = request.json.get('message')
    user_id = request.json.get('userId')
    username = request.json.get('username')
    selected_table = request.json.get('category')  # 선택된 테이블 받기

    print(f"사용자 입력: {user_input}, 사용자 ID: {user_id}, 선택된 테이블: {selected_table}")

    # 사용자가 특정 테이블을 선택했을 경우, 해당 테이블만 가져옴
    if selected_table:
        dataframe = show_data(selected_table)
    else:
        dataframe = get_all_data_in_tables()

    chatbot_response = "죄송합니다. 해당 질문에 대한 정보를 찾을 수 없습니다."

    try:
        # 데이터가 있는 경우, DB에서 우선적으로 답변 생성
        if dataframe is not None and not dataframe.empty:
            agent = create_pandas_dataframe_agent(
                ChatOpenAI(temperature=0, model='gpt-4-turbo', stream=False),
                dataframe,
                agent_type='tool-calling',
                allow_dangerous_code=True
            )

            prompt_input = f'''
                너는 금융 교육 사이트의 챗봇이야.
                사용자가 선택한 카테고리는 "{selected_table}"이야.
                사용자의 질문에 대해 **해당 테이블 데이터를 기반으로** 대답해 줘.
                사용자의 "{user_id}"에 해당하는 데이터만 대답해 줘.

                {username}님이라는 호칭을 사용하고, 간결하게 응답해 줘.
                
                정보가 확실하지 않거나 없으면 "죄송합니다. 해당 질문에 대한 정보를 찾을 수 없습니다."라고 대답해 줘.
            '''

            Chat = ChatOpenAI(temperature=0.5, model='gpt-4-turbo', stream=False)
            message = [
                {"role": "system", "content": prompt_input},
                {"role": "user", "content": user_input}
            ]

            response = agent.invoke(message)
            chatbot_response = response['output']

        # DB에서 응답이 없을 경우, LangChain을 사용해 URL 추천 실행
        if "정보를 찾을 수 없습니다." in chatbot_response:
            llm_chain = LLMChain(llm=ChatOpenAI(temperature=0), prompt=URL_PROMPT)
            recommended_url = llm_chain.run(user_input).strip()

            if recommended_url != "N/A":
                chatbot_response = f"아래 링크를 누르시면 보다 자세한 내용을 확인하실 수 있습니다.\n\n👉 [더 보기]({recommended_url})"

    except openai.APIError as api_err:
        print(f"OpenAI API 에러 발생: {api_err}")
        chatbot_response = "죄송합니다. 현재 시스템 오류로 인해 정보를 제공할 수 없습니다."
    except Exception as e:
        print(f"알 수 없는 오류 발생: {e}")
        chatbot_response = "죄송합니다. 예상치 못한 오류가 발생했습니다."

    return jsonify({"response": chatbot_response})

@app.route('/voice-chat', methods=['POST'])
def voice_chat():
    user_input = request.json.get("message")
    user_id = request.json.get("userId")
    username = request.json.get("username")
    selected_table = request.json.get("category")  # 선택된 테이블 받기

    print(f"음성 입력: {user_input}, 사용자 ID: {user_id}, 선택된 테이블: {selected_table}")

    chatbot_response = "죄송합니다. 해당 질문에 대한 정보를 찾을 수 없습니다."

    try:
        # 사용자가 특정 테이블을 선택했을 경우, 해당 테이블만 가져옴
        if selected_table:
            dataframe = show_data(selected_table)
        else:
            dataframe = get_all_data_in_tables()

        # 데이터가 있을 경우, DB에서 답변 생성
        if dataframe is not None and not dataframe.empty:
            agent = create_pandas_dataframe_agent(
                ChatOpenAI(temperature=0, model='gpt-4-turbo', stream=False),
                dataframe,
                agent_type='tool-calling',
                allow_dangerous_code=True
            )

            prompt_input = f'''
                너는 금융 교육 사이트의 챗봇이야.
                사용자가 선택한 카테고리는 "{selected_table}"이야.
                사용자의 질문에 대해 **해당 테이블 데이터를 기반으로** 대답해 줘.
                사용자의 "{user_id}"에 해당하는 데이터만 대답해 줘.

                {username}님이라는 호칭을 사용하고, 간결하게 응답해 줘.
                
                정보가 확실하지 않거나 없으면 "죄송합니다. 해당 질문에 대한 정보를 찾을 수 없습니다."라고 대답해 줘.
                
                발음이 불분명하거나 목적이 명확하지 않은 경우
                사이트에서 제공하는 기능을 중심으로 답변을 도출해 줘.
            '''

            Chat = ChatOpenAI(temperature=0.5, model='gpt-4-turbo', stream=False)
            message = [
                {"role": "system", "content": prompt_input},
                {"role": "user", "content": user_input}
            ]

            response = agent.invoke(message)
            chatbot_response = response['output']

        # DB에서 응답이 없을 경우, LangChain을 사용해 URL 추천 실행
        if any(keyword in chatbot_response for keyword in ["않습니다.", "않습니다."]):
            llm_chain = LLMChain(llm=ChatOpenAI(temperature=0), prompt=URL_PROMPT)
            recommended_url = llm_chain.run(user_input).strip()

            if recommended_url != "N/A":
                chatbot_response = f"아래 링크를 누르시면 보다 자세한 내용을 확인하실 수 있습니다.\n\n👉 [더 보기]({recommended_url})"

    except openai.APIError as api_err:
        print(f"OpenAI API 에러 발생: {api_err}")
        chatbot_response = "죄송합니다. 현재 시스템 오류로 인해 정보를 제공할 수 없습니다."
    except Exception as e:
        print(f"알 수 없는 오류 발생: {e}")
        chatbot_response = "죄송합니다. 예상치 못한 오류가 발생했습니다."

    return jsonify({"response": chatbot_response})

if __name__ == '__main__':
    os.environ['OPENAI_API_KEY'] = OPENAI_API_KEY
    app.run(port=5000)
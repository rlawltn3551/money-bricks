# pip install mariadb
import datetime

import mariadb
import pandas as pd

# 데이터 연결 정보
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "12345678",
    "database": "moneybricksdb",
    "local_infile": True
}


# 데이블 이름을 전달하면 테이블에 있는 모든 데이터 보여줌
def show_data(table):
    conn = None

    # 테이블에 접근해서 데이터를 보여줌
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        # 지정한 테이블 데이터 조회 후 데이터를 데이터프레임으로 구성
        cur.execute(f"SELECT * FROM {table}")
        rows = cur.fetchall()

        if not rows:
            print(f"{table} 테이블에 데이터가 없습니다")
            return pd.DataFrame()

        # 열이름
        columns = [x[0] for x in cur.description]

        # 데이터 중에 datetime 형식으로 불러와지는 값이 있다면, datetime이 있는 순서가 몇번 째인지 기억
        datetime_index = [i for i, value in enumerate(rows[0]) if isinstance(value, (datetime.date, datetime.datetime))]

        # 데이터
        result = []
        for r in rows:
            new_row = []
            for j, v in enumerate(r):
                if j in datetime_index:
                    val = v.strftime("%Y-%M-%d")
                else:
                    val = v
                new_row.append(val)
            result.append(new_row)

        return pd.DataFrame(result, columns=columns)

    # 에러가 발생하면 경고
    except mariadb.Error as e:
        print(f"데이터 로드 실패")
        return pd.DataFrame()

    # DB와 연결 해제
    finally:
        if conn:
            cur.close()
            conn.close()


def get_all_data_in_tables():
    conn = None
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        # 데이터 조회
        cur.execute(f"SHOW TABLES")
        rows = cur.fetchall()

        if not rows:
            print("데이터베이스 테이블 연결 실패")
            return pd.DataFrame()

        table_names = [x[0] for x in rows]
        # print(table_names)

        DB = pd.DataFrame()
        for i in range(len(table_names)):
            df = show_data(table_names[i])
            if df.empty:
                print(f"{i} 테이블이 비어있습니다.")
            DB = pd.concat([DB, df])

        if DB.empty:
            print("모든 테이블이 비어있습니다.")
        else:
            print(f"DB 데이터 로드 성공 : {DB.shape}")

        # print(DB)
        # DB.to_csv('./temp.csv')
        return DB

    except mariadb.Error as e:
        print(f"데이터 조회 실패: {e}")

    finally:
        if conn:
            cur.close()
            conn.close()


if __name__ == '__main__':
    show_data("moneybricks")
    get_all_data_in_tables()

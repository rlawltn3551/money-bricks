import { useParams } from "react-router-dom";
import "../style/QnaBoardDetailPage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import QnaDetailComponent from "../component/QnaDetailComponent";

const QnaBoardDetailPage = () => {
	const { qno } = useParams();

	return (
		<div>
			<BasicMenu />
			<div className="read-page">
				<QnaDetailComponent qno={qno}></QnaDetailComponent>
			</div>
		</div>
	);
};

export default QnaBoardDetailPage;

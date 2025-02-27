import { useParams } from "react-router-dom";
import "../style/QnaBoardModifyPage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import QnaBoardModifyComponent from "../component/QnaBoardModifyComponent";

const QnaBoardModifyPage = () => {
	const { qno } = useParams();

	return (
		<div>
			<BasicMenu />
			<div className="modify-page">
				<QnaBoardModifyComponent qno={qno} />
			</div>
		</div>
	);
};

export default QnaBoardModifyPage;

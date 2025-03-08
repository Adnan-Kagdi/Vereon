import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function DeleteRepo() {
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {

        const deleteRepo = async () => {
            try {
                const response = await axios.delete(`http://localhost:3000/repo/delete/${id}`);
                console.log(`Repo of _id ${id} are deleted!`);
                navigate("/");
            } catch (err) {
                console.log("Failed to delete! : ", err);
            }
        }

        deleteRepo();

    }, [])


}

export default DeleteRepo;
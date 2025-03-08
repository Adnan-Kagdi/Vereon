import { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar"
import { Typography, Card, CardContent, Button } from "@mui/material";
import "./userRepositories.css"

function UserRepositories() {
    const [userRepo, setUserRepo] = useState([])
    const [presignedUrl, setPresignedUrl] = useState("");

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        try {
            const getRepo = async () => {
                const repositories = await fetch(`https://vereon.onrender.com/repo/user/${userId}`);
                const data = await repositories.json();
                setUserRepo(data.result);
                console.log(data);
            }

            getRepo();
        } catch (err) {
            console.log("Error on fetching data");
        }

    }, []);


    useEffect(() => {
        fetch("https://vereon.onrender.com/get-url")
          .then(response => response.json())
          .then(data => setPresignedUrl(data.url))
          .catch(error => console.error("Error fetching pre-signed URL:", error));
      }, []);

    return (
        <div className="repo-cont row" style={{ marginTop: "5rem" }}>
            <Navbar />
            {userRepo.map((repo, index) => (
                <Card key={index} sx={{ background: "rgba(0, 208, 255, 0.1)", color: "white", marginBottom: 2 }} style={{ width: "60%" }}>
                    <CardContent>
                        <Typography variant="h5">{repo.name}</Typography>
                        <Typography variant="body2">{repo.description}</Typography>
                        <Button sx={{ marginTop: 1, color: "#58a6ff" }}>VIEW REPOSITORY</Button>
                    </CardContent>
                </Card>
            ))}
            <a href={presignedUrl} target="_blank" rel="noopener noreferrer" style={{color: "white"}}>Open File</a>
        </div>
    );
}

export default UserRepositories;
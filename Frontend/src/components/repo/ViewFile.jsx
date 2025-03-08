import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import SaveAltSharpIcon from '@mui/icons-material/SaveAltSharp';
import FloatingBtn from "./FloatingBtn";
import axios from "axios";
import Navbar from "../../Navbar/Navbar";

const StyledViewFiles = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState({});
  const [repoOwner, setRepoOwner] = useState("");
  const [copiedFile, setCopiedFile] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchRepo();
    fetchFiles();
  }, [id]);

  const fetchRepo = async () => {
    try {
      const response = await axios.get(`https://vereon.onrender.com/repo/${id}`);
      setRepoOwner(response.data.result[0].owner._id);
      console.log(response.data.result[0].owner._id);
    } catch (error) {
      console.error("Error fetching repo:", error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`https://vereon.onrender.com/repo/${id}/files`);
      setFiles(response.data || []);
      response.data.forEach(file => fetchFileContent(file._id));
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const fetchFileContent = async (fileId) => {
    try {
      const response = await axios.get(`https://vereon.onrender.com/file/${fileId}/content`);
      setFileContents(prev => ({ ...prev, [fileId]: response.data }));
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  const copyToClipboard = (text, fileName) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFile(fileName);
      setTimeout(() => setCopiedFile(null), 2000);
    });
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div style={{ display: "flex" }}>
      <Navbar />
      <div>
        {
          files.length == 0 ? (
            ""
          ) : (
            <Box sx={{ display: "flex", color: "white" }} style={{ backgroundColor: "black" }}>

              <Drawer variant="permanent" className="sidebar-box" sx={{
                width: 210, flexShrink: 0, "& .MuiDrawer-paper":
                  { width: 210, boxSizing: "border-box", background: "rgba(128, 128, 128, 0.1)", color: "white", borderRightColor: "rgba(128, 128, 128, 0.1)" }
              }}>
                <Toolbar />
                <Box sx={{ overflow: "auto" }}>
                  <List>
                    {files.map((file, index) => (
                      <ListItem button key={index}>
                        <ListItemIcon><img src="/logo.svg" style={{ width: "1.5rem" }} /></ListItemIcon>
                        <ListItemText primary={file.filename} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {
                  userId === repoOwner ? (
                    <FloatingBtn id={id} />
                  ) : (
                    ""
                  )
                }
              </Drawer>
            </Box>
          )
        }
      </div>

      <div className="repo-content"
        style={{ padding: "20px", fontFamily: "Arial, sans-serif", width: "85%", marginTop: "3.5rem" }}>
        <div>
          {files.length === 0 && userId === repoOwner ? (
            <div className="text-center" style={{ width: "95vw" }}>
              <h2 style={{ color: "grey" }}>Your Repository are empty</h2>
              <h5 className="mt-3 mb-3">
                <Link to="/details" style={{ textDecoration: "none", color: "grey" }}>
                  Instructions to import Repository &nbsp;
                  <DoubleArrowIcon />
                </Link>
              </h5>
              <Link to="/" style={{ textDecoration: "none", color: "grey" }}>
                <KeyboardDoubleArrowLeftIcon />Go to dashboard
              </Link>
              <div className="Fltg-btn">
                <FloatingBtn id={id} />
              </div>
            </div>
          ) : (
            files.map((file, index) => (
              <div key={index} style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "rgb(128,128,128, 0.5)",
                position: "relative",
              }}>
                <h3 style={{ color: "#fff" }}>{file.filename}</h3>
                <span
                  onClick={() => downloadFile(file.filename, fileContents[file._id]?.content || "")}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    color: "rgb(0,0,0, 0.9)",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  <SaveAltSharpIcon style={{ color: "white", fontSize: "1.6rem" }} />
                </span>

                <div
                  onClick={() => copyToClipboard(fileContents[file._id]?.content, file)}
                  style={{
                    position: "absolute",
                    top: "7px",
                    right: "2.7rem",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  {copiedFile === file ? "Copied!" : "Copy"}
                </div>

                <pre style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  background: "#000",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px"
                }}>
                  {fileContents[file._id]?.content || "Loading..."}
                </pre>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default StyledViewFiles;

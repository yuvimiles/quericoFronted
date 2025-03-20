import { useState } from "react";
import { Box, TextField, IconButton, CircularProgress, Typography, Alert, useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useAuth } from "../contexts/AuthContext";
import AIServices from "../services/AI-Chat-Service";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MyLocationIcon from "@mui/icons-material/MyLocation"; // Import location icon



const AI_MODELS = ["gpt-3.5-turbo", "gpt-4" , "hi"];
const AiChat = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]); // Default model
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
        null
      );

    const theme = useTheme();
    const currentUserId = useAuth().user?.id;


    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error) => {
              console.error("Error getting location:", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      };
    const sendMessage = async () => {
        if (!message.trim()) return;
    
        const newChat = [...chat, { role: "user", content: message }];
        setChat(newChat);
        setMessage("");
        setLoading(true);
      setError(null);
    
        try {
            const formData = new FormData();
            formData.append("message", message);
            formData.append("model", selectedModel);
            if(location) {
            formData.append("location", JSON.stringify(location));
            }
            if (selectedFile) formData.append("file", selectedFile);

            const { request } = AIServices.chatWithAI(formData);
            const res = await request;
    
            setChat([...newChat, { role: "assistant", content: res.data.data }]);
            setSelectedFile(null); // Clear file after sending

        } catch (error) {
            console.error("Error sending message:", error);
            setError("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };
    
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "80vh",
                width: "100%",
                maxWidth: "800px",
                margin: "auto",
                marginTop : 2,
                borderRadius: "12px",
                padding: 2,
                boxShadow: 3,
                backgroundColor: theme.palette.background.default,
                border: `1px solid ${theme.palette.secondary.main}`,
            }}
        >
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Chat Messages */}
            <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: 2 }}>
                {chat.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                            marginBottom: "8px",
                        }}
                    >
                        {msg.role === "assistant" && <SmartToyIcon sx={{ color: theme.palette.primary.main, marginRight: 1 }} />}
                        <Typography
                            sx={{
                                padding: "8px 12px",
                                borderRadius: "10px",
                                maxWidth: "75%",
                                backgroundColor: msg.role === "user" ? theme.palette.primary.main : theme.palette.secondary.main,
                                color: msg.role === "user" ? "#000" : "#fff",
                            }}
                        >
                            {msg.content}
                        </Typography>
                    </Box>
                ))}
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 1 }}>
                        <CircularProgress size={20} color="primary" />
                    </Box>
                )}
            </Box>

            {/* Input Box */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:"space-between" ,
                    borderTop: `1px solid ${theme.palette.secondary.main}`,
                    paddingTop: 1,
                    gap : 1
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Ask something..."
                    value={message}
                    multiline // Enables multiple lines
                    minRows={3} // Minimum of 3 lines
                    maxRows={3} // Maximum of 3 lines (prevents expansion)
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{
                        flex: 5,
                        marginRight: 1,
                        backgroundColor: theme.palette.background.default,
                        input: { color: theme.palette.text.primary },
                    }}
                />
                        <IconButton color="primary" onClick={getLocation} sx={{
                             border : `1px solid ${theme.palette.secondary.main}`
                        }}>
                        <MyLocationIcon />
                        </IconButton>
                <Box sx={{ display: "flex" ,gap: 1, mt: 2 }}>
                    {/* Model Selection */}
                    <TextField
                        select
                        label="Select Model"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{  width: "auto",
                            backgroundColor: theme.palette.background.default ,
                            paddingBottom : 2
                        }}
                    >
                       {AI_MODELS.map((model) => (
                        <option key={model} value={model}>
                            {model.toUpperCase().replace(/-/g, " ")} {/* Format display text */}
                        </option>
                          ))}
                    </TextField>

                    {/* File Upload */}
                    <IconButton
                    color="primary"
                    component="label"
                    sx={{
                        padding: 0,
                        marginTop: 1,
                        width: 40, // Adjust icon size
                        height: 40,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: theme.palette.background.default,
                        border : `1px solid ${theme.palette.secondary.main}`
                    }}
                    >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                    />
                    <AttachFileIcon />
                    </IconButton>
                    
                    {selectedFile && (
                        <Typography sx={{ fontSize: 14, color: "gray" }}>
                            Selected: {selectedFile.name}
                        </Typography>
                    )}
                </Box>

                <IconButton color="primary" onClick={sendMessage} disabled={loading} sx={{
                     border : `1px solid ${theme.palette.secondary.main}`
                }}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default AiChat;

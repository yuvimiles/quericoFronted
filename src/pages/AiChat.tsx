import { useState } from "react";
import { Box, TextField, IconButton, CircularProgress , Alert, useTheme, Input } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../contexts/AuthContext";
import AIServices from "../services/AI-Chat-Service";
import MyLocationIcon from "@mui/icons-material/MyLocation"; // Import location icon
import ChatBubble  from "../components/animatedBubble.tsx";


const passwordMatch = "456456"
const AI_MODELS = ["gpt-3.5-turbo", "gpt-4" , "gpt-4o" , "gpt-4o-mini"];
const AiChat = () => {
    const [password , setPassword] = useState("")
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
        null
      );

    const theme = useTheme();
    const currentUser = useAuth().user;

    const toggleLocation = () => {
        if (location) {
            setLocation(null);
        } else {
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
        }
    };
    const sendMessage = async () => {
        if(password === passwordMatch){
        if (!message.trim()) return;
    
        const newChat = [...chat, { role: "user", content: message }];
        setChat(newChat);
        setMessage("");
        setLoading(true);
        setError(null);
    
        try {
            const data = {
                message,              // The user's message
                model: selectedModel,  // The selected AI model
                location: location ? location : null, // Location data, if available
                history: newChat      // Chat history
            };
            const { request } = AIServices.chatWithAI(data);
            const res = await request;
            setChat([...newChat, { role: "assistant", content: res.data.choices[0].message.content }]);

        } catch (error) {
            console.error("Error sending message:", error);
            setError("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    }else{
        alert("password incorrect ya maniak")
    }
    };
    
    return (
        <Box>
            <Input
            sx={{width: "100%",
                maxWidth: "400px",
                margin: "auto",
                marginTop : 2,}}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter password for api access"
            />
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
            <ChatBubble message={import.meta.env.VITE_AI_MESSAGE} 
            avatarSrc="https://randomuser.me/api/portraits/men/10.jpg" />
                {chat.map((msg, index) => (
                    <Box
                    key={index}
                    sx={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        alignItems: "center",
                        marginBottom: "8px",
                    }}
                >
                    {msg.role === "assistant" ? (
                        <ChatBubble 
                        message={msg.content}
                        avatarSrc="https://randomuser.me/api/portraits/men/10.jpg"  // Use any avatar image URL
                      />
                    ) : (
                        <ChatBubble 
                        message={msg.content}
                        avatarSrc={currentUser?.profileImage || import.meta.env.VITE_DEFAULT_USER_PHOTO}   // Use any avatar image URL
                      />
                    )}
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
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault(); // Prevents new line
                            sendMessage();
                        }
                    }}
                    sx={{
                        flex: 5,
                        marginRight: 1,
                        backgroundColor: theme.palette.background.default,
                        input: { color: theme.palette.text.primary },
                    }}
                />
                        {/* Location Toggle Button */}
                <IconButton 
                    color={location ? "secondary" : "primary"} 
                    onClick={toggleLocation} 
                    sx={{ border: `1px solid ${theme.palette.secondary.main}` }}
                >
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
                </Box>

                <IconButton color="primary" onClick={sendMessage} disabled={loading} sx={{
                     border : `1px solid ${theme.palette.secondary.main}`
                }}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
        </Box>
    );
};

export default AiChat;

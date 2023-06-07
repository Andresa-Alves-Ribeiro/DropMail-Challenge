import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    TextareaAutosize,
    TextField,
    Typography,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";

import { GENERATE_EMAIL, useCheckEmailQuery } from "../utils/Client";

export default function Main() {
    const [emailBody, setEmailBody] = useState("");
    const [emailHeader, setEmailHeader] = useState("");
    const [emailText, setEmailText] = useState("");
    const [welcomeHeader, setWelcomeHeader] = useState("");
    const [welcomeBody, setWelcomeBody] = useState("");
    const [count, setCount] = useState(15);

    function permission() {
        if (window.Notification.permission !== "granted") {
            window.Notification.requestPermission((permission) => {
                if (permission === "granted") {
                    alert("Notificações habilitadas!");
                }
            });
        }
    }

    const [handleGenerateEmail] = useMutation(GENERATE_EMAIL, {
        onCompleted: (el) => {
            sessionStorage.setItem("@SESSION_ID", el.introduceSession.id);
            sessionStorage.setItem(
                "@TEMP_EMAIL",
                el.introduceSession.addresses[0].address
            );
            setEmailBody(sessionStorage.getItem("@TEMP_EMAIL"));
        },
        onError: (err) => {
            console.log(err);
        },
    });

    useEffect(() => {
        if (sessionStorage.getItem("@TEMP_EMAIL")) {
            setEmailBody(sessionStorage.getItem("@TEMP_EMAIL"));
        }
        handleGenerateEmail();
    }, []);

    function handleCopyEmail() {
        if (emailBody.includes("@")) {
            navigator.clipboard.writeText(emailBody);
            alert("Texto copiado!");
        } else {
            alert("Erro! Não há um email para copiar");
        }
    }

    function ShowEmails() {
        const { data, errors } = useCheckEmailQuery();

        if (errors) return console.log(errors);

        const defaultWelcomeEmail = {
            from: "Hello",
            header: "Welcome",
            text: `Hi user,
Your temp e-mail address is ready
If you need help read the information below and do not hesitate to contact us.
All the best,
DropMail`,
        };

        if (data) {
            setTimeout(() => {
                if (count > 1) {
                    setCount(count - 1);
                }
            }, 1000);

            if (count === 1) {
                window.location.reload(false);
            }

            return (
                <>
                    {data.session.mails.length === 0 ? (
                        <Box
                            className="p-1.5 flex flex-col justify-center border-solid border-b border-borderGray h-6v min-h-130 w-full hover:bg-gray-100"
                            style={{
                                justifyContent: "center",
                                minHeight: "150px",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setWelcomeBody(defaultWelcomeEmail.text);
                                setWelcomeHeader(defaultWelcomeEmail.header);
                            }}
                        >
                            <Typography style={{ fontWeight: "bold" }}>
                                {defaultWelcomeEmail.from}
                            </Typography>
                            <Typography
                                style={{ fontWeight: "bold", color: "#0078da" }}
                            >
                                {defaultWelcomeEmail.header}
                            </Typography>
                            <Typography style={{ color: "#8f949f" }}>
                                {defaultWelcomeEmail.text.length <= 20
                                    ? defaultWelcomeEmail.text
                                    : defaultWelcomeEmail.text.substring(
                                        0,
                                        25
                                    ) + "..."}
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {data.session.mails.map((el, i) => (
                                <Box
                                    key={i}
                                    className="p-1.5 flex flex-col justify-center border-solid border-b border-borderGray h-6v min-h-130 w-full hover:bg-gray-100"
                                    onClick={() => {
                                        setEmailHeader(el.headerSubject);
                                        setEmailText(el.text);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <Typography
                                        key={i + 4}
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {el.fromAddr.length <= 14
                                            ? el.fromAddr
                                            : el.fromAddr.substr(0, 14) + "..."}
                                    </Typography>
                                    <Typography
                                        key={i + 2}
                                        style={{
                                            fontWeight: "bold",
                                            color: "#0078da",
                                        }}
                                    >
                                        {el.headerSubject.length <= 20
                                            ? el.headerSubject
                                            : el.headerSubject.substr(0, 20) +
                                            "..."}
                                    </Typography>
                                    <Typography key={i + 3}>
                                        {el.text.length <= 20
                                            ? el.text
                                            : el.text.substr(0, 20) + "..."}
                                    </Typography>
                                </Box>
                            ))}
                        </>
                    )}
                </>
            );
        }
    }

    return (
        <Box className="box-border">
            <Box className="flex flex-col h-screen w-screen">
                <Box className="flex justify-center items-center text-center h-1/4 min-h-190px">
                    <Box className="flex flex-col w-1/1">
                        <Typography
                            style={{
                                display: "flex",
                                justifyContent: "start",
                                fontSize: "12px",
                                marginTop: "10px",
                            }}
                        >Your temporary email address</Typography>
                        {emailBody.includes("@") ? (
                            <>
                                <TextField
                                    id="email"
                                    placeholder="Email"
                                    value={emailBody}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{
                                        readOnly: true,
                                        style: {
                                            fontWeight: "bold",
                                        }
                                    }}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" >
                                                <Divider orientation="vertical" />
                                                <IconButton
                                                    aria-label="ContentCopyIcon"
                                                    onClick={handleCopyEmail}
                                                    sx={{
                                                        borderRadius: '0',
                                                        '&:hover': {
                                                            backgroundColor: 'transparent',
                                                            transform: 'scale(1.05)'
                                                        },
                                                    }}
                                                >
                                                    <ContentCopyIcon />
                                                    <Typography 
                                                    variant="caption"
                                                    sx={{
                                                        fontSize: '16px',
                                                        '&:hover': {
                                                            fontWeight: 'bold'
                                                        },
                                                    }}
                                                    >
                                                        Copy
                                                    </Typography>
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    {emailBody}
                                </TextField>

                                <Box
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "10px",
                                    }}
                                >
                                    <Box
                                        style={{
                                            display: "inline-flex",
                                            textAlign: "center",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            style={{
                                                marginRight: "12px",
                                                fontSize: "14px"
                                            }}
                                        >
                                            Autorefresh in
                                        </Typography>
                                        <Box
                                            style={{
                                                position: "relative",
                                                display: "inline-flex",
                                            }}
                                        >
                                            <CircularProgress
                                                variant="determinate"
                                                value={(count * 100) / 15}
                                                style={{ width: "30px" }}
                                            />
                                            <Box
                                                style={{
                                                    top: 0,
                                                    left: 0,
                                                    bottom: 0,
                                                    right: 9,
                                                    position: "absolute",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    style={{
                                                        fontSize: "14px",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {count}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box
                                        style={{
                                            display: "flex",
                                            gap: "2px",
                                            marginLeft: "8px",
                                            alignItems: "center",
                                            textAlign: "center",
                                        }}
                                    >
                                        <RefreshIcon
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                window.location.reload(false)
                                            }
                                        />
                                        <Typography
                                            style={{
                                                fontSize: "14px"
                                            }}>Refresh</Typography>
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <>
                                <TextField
                                    id="email"
                                    value={emailBody}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{
                                        readOnly: true,
                                    }}
                                    onClick={handleGenerateEmail}
                                ></TextField>
                            </>
                        )}
                    </Box>
                </Box>

                <Box className="flex w-full h-[75vh]">
                    <Box className="flex flex-col border-l border-r border-b border-t rounded-bl-2 rounded-br-2 border-solid border-borderGray w-22vw min-w-110">
                        <Box className="p-2 flex items-center justify-center text-center border-b border-solid border-borderGray h-10 min-h-8 w-full">
                            <Typography>Inbox</Typography>
                        </Box>
                        <Box className="flex flex-col h-[41vh] w-full">
                            <ShowEmails />
                        </Box>
                    </Box>

                    <Box className="flex flex-col border-b-2 border-r border-t rounded-bl-2 rounded-br-2 border-solid border-borderGray w-[98vw] bg-gray-100">
                        <Box className="p-2 flex items-center border-b rounded-br-2 border-solid border-borderGray justify-between text-center h-10 min-h-8 w-full">
                            <Button
                                style={{
                                    marginRight: "10px",
                                    height: "3vh",
                                }}
                                variant="contained"
                                onClick={permission}
                            >
                                <Typography style={{ fontSize: "11px", fontWeight: 'bold' }}>
                                    receber notificações
                                </Typography>
                            </Button>
                        </Box>
                        <Box className="px-7 gap-5 flex flex-col w-full mt-1">
                            <Typography
                                style={{
                                    marginLeft: "8px",
                                    fontWeight: "bold",
                                }}
                            >
                                {emailHeader === ""
                                    ? welcomeHeader
                                    : emailHeader}
                            </Typography>
                            <Box className="p-2 flex flex-col w-full h-full border-b border-r border-t border-l border-solid border-borderGray rounded bg-white">
                                <TextareaAutosize
                                    value={
                                        emailText === ""
                                            ? welcomeBody
                                            : emailText
                                    }
                                    style={{
                                        width: "100%",
                                        height: "60vh",
                                        resize: "none",
                                        fontSize: "18px",
                                        outline: "none",
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    );
}
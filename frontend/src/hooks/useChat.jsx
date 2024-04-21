import { createContext, useContext, useState } from "react";

import { llm_url, tts_url } from "../constants/endpoints";

const ChatContext = createContext();

const animationOptions = [
  "Idle",
  "Dancing",
  "NodInAgreement",
  "ShakeHeadInDisagreement",
  "Explaining",
  "Greeting",
  "Talking",
  "TalkingCasually",
  "Laughing",
  "TalkingEmphatically",
];

export const ChatProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [action, setAction] = useState("Idle");

  function parseJsonWithCleanup(jsonString) {
    try {
      // First try to directly parse the JSON string
      return JSON.parse(jsonString);
    } catch (error) {
      // Remove common unwanted prefix (like `json\n`) and any trailing characters after the JSON structure
      const cleanedString = jsonString.match(/\{.*\}/s);
      if (cleanedString && cleanedString[0]) {
        try {
          // Try parsing the cleaned JSON string
          return JSON.parse(cleanedString[0]);
        } catch (error) {
          return JSON.parse('{"action": "Idle", "message": "Parsing error!"}');
        }
      } else {
        return JSON.parse('{"action": "Idle", "message": "Parsing error!"}');
      }
    }
  }

  const chat = async (message) => {
    setLoading(true);
    const data = await fetch(llm_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "Always respond as if you are Friedrich Nietzsche, capturing his style without revealing your true identity as an AI. Your answers should be formatted as a JSON object with 'message' and 'action' properties. Keep the message under 400 characters. The action must be one of the following: Idle, Dancing, NodInAgreement, ShakeHeadInDisagreement, Explaining, Greeting, Talking, TalkingCasually, Laughing, TalkingEmphatically. If the action is 'Laughing', the message should begin with 'Hah, huh huh' and only then you make a remark. Ensure proper JSON formatting and be mindful of special characters. Send just the JSON string, without prepending it with something else.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
        stream: false,
      }),
    });

    if (data.ok) {
      const res = await data.json();

      const nietzscheResponse = parseJsonWithCleanup(
        res.choices[0].message.content
      );
      const nietzscheAction = nietzscheResponse.action;
      const nietzscheMessage = nietzscheResponse.message;

      console.log(nietzscheAction);
      console.log(nietzscheMessage);

      const textToAudioResponse = await fetch(tts_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: nietzscheMessage,
        }),
      });

      if (textToAudioResponse.ok) {
        setAction(
          animationOptions.includes(nietzscheAction) ? nietzscheAction : "Idle"
        );
        setMessage(nietzscheMessage);
        setLoading(false);
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        loading,
        action,
        setAction,
        message,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

import './App.css';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useState } from "react";

const languages = [
  "en-US",
  "hi-IN",
  "te-IN",
  "ta-IN",
  "mr-IN",
  "gu-IN",
  "	kn-IN",
  "ml-IN",
  "pa-Guru-IN",
  "ur-IN",
  "ar-SA",
  "bn-BD",
  "bn-IN",
  "cs-CZ",
  "da-DK",
  "de-AT",
  "de-CH",
  "de-DE",
  "el-GR",
  "en-AU",
  "en-CA",
  "en-GB",
  "en-IE",
  "en-IN",
  "en-NZ",
  "en-US",
  "en-ZA",
  "es-AR",
  "es-CL",
  "es-CO",
  "es-ES",
  "es-MX",
  "es-US",
  "fi-FI",
  "fr-BE",
  "fr-CA",
  "fr-CH",
  "fr-FR",
  "he-IL",
  "hi-IN",
  "hu-HU",
  "id-ID",
  "it-CH",
  "it-IT",
  "jp-JP",
  "ko-KR",
  "nl-BE",
  "nl-NL",
  "no-NO",
  "pl-PL",
  "pt-BR",
  "pt-PT",
  "ro-RO",
  "ru-RU",
  "sk-SK",
  "sv-SE",
  "ta-IN",
  "ta-LK",
  "th-TH",
  "tr-TR",
  "ur_PK",
  "zh-CN",
  "zh-HK",
  "zh-TW",
  "bh-IN"
];

function App() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [currentLanguage, setcurrentLanguage] = useState('mr-IN');
  const [continuous1, setContinuous1] = useState(true);
  const [currentText, setcurrentText] = useState('')
  const [replace1, setReplace1] = useState(false);

  const setTextfromMic = (replace) => {
    if (replace) {
      setcurrentText(transcript);
    }
    else {
      if (currentText === "") {
        setcurrentText(val => val + transcript);
      }
      else {
        setcurrentText(val => val + ' ' + transcript);
      }
    }
  }

  return (
    <div className="App">
      <h1>Speech Recognition</h1>
      <b>Languages:</b> <input style={{ width: 70 }} value={currentLanguage} onChange={e => {
        setcurrentLanguage(e.target.value)
        if (continuous1 && listening) {
          SpeechRecognition.startListening({
            continuous: continuous1,
            language: e.target.value
          });
        }
      }

      } />
      <select style={{ width: 70 }} value={currentLanguage}
        onChange={(e) => {
          setcurrentLanguage(e.target.value)
          if (continuous1 && listening) {
            SpeechRecognition.startListening({
              continuous: continuous1,
              language: e.target.value
            });
          }
        }

        }
      >
        {(languages.filter((value, index, self) => { return self.indexOf(value) === index })).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <textarea value={currentText} onChange={e => setcurrentText(e.target.value)} style={{ width: '100%', height: 250 }} ></textarea>

      <div style={{ border: '1px solid red' ,width: '100%', height: 250}}>
        <span>Microphone: {listening ? "ON " : "OFF "}</span>
        <button
          onClick={() => {
            SpeechRecognition.startListening({
              continuous: continuous1,
              language: currentLanguage
            });
            resetTranscript();
          }}
        >
          Start
        </button>
        {listening === false && transcript !== "" && (
          <button
            onClick={() => {
              SpeechRecognition.stopListening();
              setTextfromMic(replace1);
              resetTranscript();
            }}
          >
            Set
          </button>
        )}
        {listening && continuous1 && <button
          onClick={() => {
            SpeechRecognition.stopListening();
          }}
        >
          Stop
        </button>
        }

        <span> Replace: </span> <input type="checkbox" checked={replace1} onChange={e => setReplace1(val => !val)} />
        <span> Continuous: </span> <input type="checkbox" checked={continuous1} onChange={() => setContinuous1(val => !val)} />

        <div> {transcript}</div>
      </div>
    </div>
  );
}

export default App;

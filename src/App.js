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
const openaiAddress = () => {
  if (window.location.origin === 'https://vimlesh1975.github.io') {
    return 'https://octopus-app-gzws3.ondigitalocean.app/'
  }
  else {
    return 'http://localhost:9000/'
  }
}
function App() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [currentLanguage, setcurrentLanguage] = useState('en-US');
  const [continuous1, setContinuous1] = useState(true);
  const [currentText, setcurrentText] = useState('')
  const [replace1, setReplace1] = useState(false);
  const [aiText, setAitext] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [image1, setImage1] = useState([])


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

  const sendToOpenAi = async (str) => {
    const response = await fetch(openaiAddress() + 'openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: str,
        model: "text-davinci-003",
      })
    })

    if (response.ok) {
      const data = await response.json();
      // trims any trailing spaces/'\n' 
      setAitext(data.bot.trim())

    } else {
      const err = await response.text()
      // alert(err)
      setAitext(err)
      console.log(err)
    }

  }
  const sendToOpenAiforImage = async (str) => {
    const response = await fetch(openaiAddress() + 'openaiimage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: str,
      })
    })

    if (response.ok) {
      const data = await response.json();
      setImage1([...image1, data.bot.trim()]);

    } else {
      const err = await response.text()
      // alert(err)
      setAitext(err)
      console.log(err)
    }

  }
  return (<div>
    <div style={{ display: 'flex' }}>
      <div className="App" style={{ width: '50%' }}>
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

        <div style={{ border: '1px solid red', width: '100%', height: 250 }}>
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
          <button onClick={() => sendToOpenAi(transcript)}>Send To open AI</button>
          <button onClick={() => sendToOpenAiforImage(transcript)}>Create image</button>

          <div>{transcript}</div>
        </div>
      </div>
      <div style={{ border: '1px solid red', width: '50%' }}>
        <h1>Open Ai question answer</h1>

        Type Here:<textarea value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} style={{ width: '80%', height: 20 }} ></textarea>
        <button onClick={() => sendToOpenAi(aiQuestion)}>Send To open AI</button>  <button onClick={() => sendToOpenAiforImage(aiQuestion)}>Create image</button>
        <textarea value={aiText} onChange={e => setAitext(e.target.value)} style={{ width: '100%', height: '50%%' }} ></textarea>
        {image1.map((val, i) => {
          return <img width={300} height={200} key={i} src={val} alt='' />
        })}

      </div>
    </div>
  </div>);
}

export default App;

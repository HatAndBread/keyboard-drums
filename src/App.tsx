import React, { useEffect, useState, createContext } from 'react';
import './App.css';
import * as Tone from 'tone';
import Keyboard from './app/music-logic/Keyboard';
import {
  musicLoop,
  sendBoard,
  sendKeyboardNames,
  sendSetKeyboard,
  sendCurrentKeyboardName,
} from './app/music-logic/music-loop';
import KeyboardEditor from './app/components/keyboard-editor/KeyboardEditor';
import ModalController from './app/components/modal/ModalController';
import createListeners from './app/music-logic/keyboard-listeners';
import Nav from './app/components/nav/Nav';
import OnBufferLoad from './OnBufferLoad';
import ContextProps from './types/ContextProps';
import ValidKeys from './types/ValidKeys';
import KeyboardTabs from './app/components/keyboard-tabs/KeyboardTabs';
import Visualization from './app/components/visualization/Visualization';
import LandingPage from './app/components/landing-page/LandingPage';
import Loader from './app/components/Loader/Loader';
import Hints from './app/components/hints/Hints';
import Icon from './app/components/icon/Icon';
import gitHub from './assets/images/github.png';
import linkedIn from './assets/images/linkedin.png';

//@ts-ignore
const isBadBrowser = !window.MediaRecorder;

function unloadHandler(e: BeforeUnloadEvent) {
  e.preventDefault();
  e.returnValue = '';
}
window.addEventListener('beforeunload', unloadHandler);

export const Context = createContext<Partial<ContextProps>>({});
function App() {
  const [attemptingToLoad, setAttemptingToLoad] = useState(false);
  const [appIsStarted, setAppIsStarted] = useState(false);
  const [buffers, setBuffers] = useState<{
    [key: string]: Tone.ToneAudioBuffer;
  }>({});
  const [keyboards, setKeyboards] = useState<null | {
    [key: string]: Keyboard;
  }>(null);
  const [keyboardNames, setKeyboardNames] = useState<string[]>([]);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [keyBeingEdited, setKeyBeingEdited] = useState<ValidKeys | null>(null);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [currentKeyboardName, setCurrentKeyboardName] = useState<string>(
    keyboardNames[0]
  );
  const [currentKeyboard, setCurrentKeyboard] = useState<null | Keyboard>(null);
  const [showAnim, setShowAnim] = useState(false);
  const [showHints, setShowHints] = useState(true);

  useEffect(() => {
    const deleteMe = document.getElementById('first-loader-container');
    deleteMe?.remove();
    createListeners();
    musicLoop();
  }, []);
  useEffect(() => {
    if (keyboards) {
      sendBoard(keyboards[currentKeyboardName]);
      setCurrentKeyboard(keyboards[currentKeyboardName]);
    }
    setAttemptingToLoad(false);
  }, [keyboards, currentKeyboardName]);
  useEffect(() => {
    sendSetKeyboard(setCurrentKeyboardName);
  }, [setCurrentKeyboardName]);
  useEffect(() => {
    sendKeyboardNames(keyboardNames);
  }, [keyboardNames]);
  useEffect(() => {
    sendCurrentKeyboardName(currentKeyboardName);
  }, [currentKeyboardName]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && showHints) {
        setShowHints(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setShowHints, showHints]);

  return (
    <Context.Provider
      value={{
        appIsStarted,
        buffers,
        keyboards,
        setKeyboards,
        keyboardNames,
        setKeyboardNames,
        currentKeyboard,
        currentKeyboardName,
        setCurrentKeyboardName,
        currentModal,
        setCurrentModal,
        keyBeingEdited,
        setKeyBeingEdited,
        setEditorOpen,
        showAnim,
        setShowAnim,
      }}>
      <div className='App'>
        <OnBufferLoad />
        {attemptingToLoad ? (
          <Loader />
        ) : (
          <>
            {!appIsStarted ? (
              <div>
                <LandingPage
                  isBadBrowser={isBadBrowser}
                  setAttemptingToLoad={setAttemptingToLoad}
                  setAppIsStarted={setAppIsStarted}
                  setBuffers={setBuffers}
                />
              </div>
            ) : (
              <>
                <Nav isBadBrowser={isBadBrowser} />

                <div className='body-content'>
                  {!editorOpen && (
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: '16px',
                        fontSize: '16px',
                        width: '160px',
                        justifyContent: 'space-between',
                      }}></div>
                  )}
                  <KeyboardTabs />
                  {editorOpen ? (
                    <KeyboardEditor />
                  ) : (
                    <>
                      <Visualization
                        showAnim={showAnim}
                        isBadBrowser={isBadBrowser}
                      />
                      {showHints && (
                        <Hints
                          isBadBrowser={isBadBrowser}
                          setShowHints={setShowHints}
                        />
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
        <ModalController currentModal={currentModal} />
        {!appIsStarted && (
          <footer>
            <p>Made with ♥️ by Joshua Hume</p>
            <div
              style={{
                display: 'flex',
                width: '100px',
                justifyContent: 'space-between',
              }}>
              <Icon
                className='footer-icon'
                src={gitHub}
                alt='GitHub'
                pointer={true}
                onClick={() =>
                  window.open('https://github.com/HatAndBread', '_blank')
                }
              />
              <Icon
                className='footer-icon'
                src={linkedIn}
                alt='LinkedIn'
                pointer={true}
                onClick={() =>
                  window.open(
                    'https://www.linkedin.com/in/joshua-hume-0259691ab/',
                    '_blank'
                  )
                }
              />
            </div>
            <div>
              Enjoy The Keyboard Keyboard?{' '}
              <a
                href='https://www.paypal.com/paypalme/hatandbread'
                rel='noreferrer'
                target='_blank'>
                Buy me a beer 🍺
              </a>
            </div>

            <div>
              Icons made by{' '}
              <a href='from www.flaticon.com' rel='noreferrer' target='_blank'>
                Freepik
              </a>{' '}
              from{' '}
              <a href='from www.flaticon.com' rel='noreferrer' target='_blank'>
                www.flaticon.com
              </a>
            </div>
          </footer>
        )}
      </div>
    </Context.Provider>
  );
}

export default App;

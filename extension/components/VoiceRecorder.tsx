import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';

interface VoiceRecorderProps {
  onComplete: (transcript: string) => void;
  onCancel: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onComplete, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
      };
      
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  const startRecording = async () => {
    try {
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      // Start audio level monitoring for visual feedback
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255 * 100);
          animationRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsRecording(false);
  };
  
  const handleComplete = () => {
    stopRecording();
    if (transcript.trim()) {
      onComplete(transcript.trim());
    } else {
      onCancel();
    }
  };
  
  const handleCancel = () => {
    stopRecording();
    onCancel();
  };
  
  // Auto-start recording when component mounts
  useEffect(() => {
    startRecording();
  }, []);
  
  return (
    <div className="voice-recorder-overlay">
      <div className="voice-recorder">
        <div className="recorder-header">
          <h3>Voice Recording</h3>
        </div>
        
        <div className="recorder-visual">
          <div className="microphone-icon">
            {isRecording ? (
              <Mic size={48} style={{ color: '#FF10F0' }} />
            ) : (
              <MicOff size={48} style={{ color: '#666' }} />
            )}
          </div>
          
          <div className="audio-visualizer">
            <div className="waveform">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="wave-bar"
                  style={{
                    height: `${Math.random() * audioLevel + 10}%`,
                    backgroundColor: `hsl(${280 + (audioLevel * 2)}, 100%, 60%)`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="transcript-preview">
            {transcript || 'Listening...'}
          </div>
        </div>
        
        <div className="recorder-controls">
          <button
            className="recorder-button cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          
          <button
            className="recorder-button stop"
            onClick={stopRecording}
            disabled={!isRecording}
          >
            <Square size={20} />
          </button>
          
          <button
            className="recorder-button complete"
            onClick={handleComplete}
            disabled={!transcript.trim()}
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;

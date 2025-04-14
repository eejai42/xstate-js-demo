import React from 'react';
import { useMachine } from '@xstate/react';
import { machine } from './assets/machine';
// import './styles.css';

export default function App() {
  const [state, send] = useMachine(machine);

  return (
    <div className="App">
      <div>
        <div className="state-key"></div>
        
        <div>
          <button className="event-button" onClick={() => send({ type: 'PRESS_WALK' })}>PRESS_WALK</button>
        </div>
      
          {state.matches("walk") && (
        <div>
          <div className="state-key">walk</div>
          <p className="state-description">The pedestrian walk signal is on. Pedestrians can cross. The light will turn to stop next.</p>
          <div>
            <button className="event-button" onClick={() => send({ type: 'TICK' })}>TIMER</button>
        <button className="event-button" onClick={() => send({ type: '' })}>Event2</button>
          </div>
        
          
        
          
        </div>
        )}
      
        {state.matches("stop") && (
        <div>
          <div className="state-key">stop</div>
          <p className="state-description">The pedestrian stop signal is on. Pedestrians should not cross. The light will turn red next.</p>
          <div>
            <button className="event-button" onClick={() => send({ type: 'TIMER' })}>TIMER</button>
          </div>        
              {true && (
            <div>
              <div className="state-key">stop.New state 1</div>
              
              <div>
                
              </div>
            
              
            
              
            </div>
            )}
        
          
        </div>
        )}
      
        {state.matches("yellow") && (
        <div>
          <div className="state-key">yellow</div>
          <p className="state-description">The traffic light is yellow. Vehicles should prepare to stop. The light will turn red next.</p>
          <div>
            <button className="event-button" onClick={() => send({ type: 'TIMER' })}>TIMER</button>
          </div>
        
          
        
          
        </div>
        )}
      
        {state.matches("red") && (
        <div>
          <div className="state-key">red</div>
          <p className="state-description">The traffic light is red. Vehicles must stop, and pedestrians can press the walk button to request a walk signal.</p>
          <div>
            <button className="event-button" onClick={() => send({ type: 'TIMER' })}>TIMER</button>
        <button className="event-button" onClick={() => send({ type: 'PRESS_WALK' })}>PRESS_WALK</button>
        <button className="event-button" onClick={() => send({ type: 'PRESS_RIGHT_TURN' })}>PRESS_RIGHT_TURN</button>
          </div>
        
          
        
          
        </div>
        )}
      
        {state.matches("green") && (
        <div>
          <div className="state-key">green</div>
          <p className="state-description">The traffic light is green. Vehicles can go straight. If the right turn arrow was requested, it will turn on after the green light.</p>
          <div>
            <button className="event-button" onClick={() => send({ type: 'TIMER' })}>TIMER</button>
        <button className="event-button" onClick={() => send({ type: 'EMERGENCY_STOP' })}>EMERGENCY_STOP</button>
          </div>
        
          
        
          
        </div>
        )}
      
        {state.matches("greenArrow") && (
        <div>
          <div className="state-key">greenArrow</div>
          <p className="state-description">The right turn arrow is green. Vehicles can make a right turn. The light will turn yellow next.</p>
          <div>
            <button className="event-button" onClick={() => send({ type: 'TIMER' })}>TIMER</button>
          </div>
        
          
        
          
        </div>
        )}
      
        {state.matches("yellowArrow") && (
        <div>
          <div className="state-key">yellowArrow</div>
          <p className="state-description">The right turn arrow is yellow. Vehicles should prepare to stop turning. The light will turn red next.</p>
          <div>
            <button className="event-button" onClick={() => send({ type: 'TIMER' })}>TIMER</button>
          </div>
        
          
        
          
        </div>
        )}
      
        <pre>{JSON.stringify(state.context, null, 2)}</pre>
      </div>
    </div>
  );
}
  
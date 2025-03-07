This State Machine, named "trafficLight" has the initial state "walk".

State "walk":
  - The pedestrian walk signal is on. Pedestrians can cross. The light will turn to stop next.
  - Transitions:
    - On event "TIMER":
        → "stop" 
    - On event "Event2":
        → "yellow" 

State "stop":
  - The pedestrian stop signal is on. Pedestrians should not cross. The light will turn red next.
  - Transitions:
    - On event "TIMER":
        → "red" 

State "yellow":
  - The traffic light is yellow. Vehicles should prepare to stop. The light will turn red next.
  - Transitions:
    - On event "TIMER":
        → "red" 

State "red":
  - The traffic light is red. Vehicles must stop, and pedestrians can press the walk button to request a walk signal.
  - Transitions:
    - On event "TIMER":
        → "green" 
    - On event "PRESS_WALK":
        → "yellow" 
    - On event "PRESS_RIGHT_TURN":
        → "" 

State "green":
  - The traffic light is green. Vehicles can go straight. If the right turn arrow was requested, it will turn on after the green light.
  - Transitions:
    - On event "TIMER":
          → "greenArrow" 
          → "yellow" 
    - On event "EMERGENCY_STOP":
        → "stop" 

State "greenArrow":
  - The right turn arrow is green. Vehicles can make a right turn. The light will turn yellow next.
  - Transitions:
    - On event "TIMER":
        → "yellowArrow" 

State "yellowArrow":
  - The right turn arrow is yellow. Vehicles should prepare to stop turning. The light will turn red next.
  - Transitions:
    - On event "TIMER":
        → "red" 



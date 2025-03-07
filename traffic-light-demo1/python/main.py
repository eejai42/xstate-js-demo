import time
from xstate_implementation import XStateHandler

def main():
    machine = XStateHandler()
    print(f"Initial State: {machine.state}")

    events = ["TIMER", "PRESS_WALK", "PRESS_RIGHT_TURN", "TIMER", "TIMER"]
    for event in events:
        print(f"\nSending event: {event}")
        machine.handle_event(event)
        time.sleep(3)

if __name__ == "__main__":
    main()
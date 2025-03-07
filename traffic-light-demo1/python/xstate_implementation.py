from xstate_machine_sdk import TrafficLightBase

class XStateHandler(TrafficLightBase):
    def __init__(self):
        super().__init__()

    def red_PRESS_WALK(self):    
        print("this is the new handler")

    def red_TIMER(self):
        print("Default handler: red_TIMER invoked.")

    def red_PRESS_WALK_BUTTON(self):
        print("Default handler: red_PRESS_WALK_BUTTON invoked.")

    def red_PRESS_RIGHT_TURN(self):
        print("Default handler: red_PRESS_RIGHT_TURN invoked.")

    def green_TIMER(self):
        print("Default handler: green_TIMER invoked.")

    def greenArrow_TIMER(self):
        print("Default handler: greenArrow_TIMER invoked.")

    def yellow_TIMER(self):
        print("Default handler: yellow_TIMER invoked.")

    def yellowArrow_TIMER(self):
        print("Default handler: yellowArrow_TIMER invoked.")

    def walk_TIMER(self):
        print("Default handler: walk_TIMER invoked.")

    def stop_TIMER(self):
        print("Default handler: stop_TIMER invoked.")
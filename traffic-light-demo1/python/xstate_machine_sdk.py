class TrafficLightBase:
    def __init__(self):
        self.context = {
           "walkButtonPressed": False,
           "rightTurnRequested": False,
        }
        self.state = "red"

    def handle_event(self, event):
        handler_name = f"{self.state}_{event}"
        handler = getattr(self, handler_name, None)
        if handler:
            handler()
        else:
            raise ValueError(f"Event '{event}' not handled in state '{self.state}'")

    def red_TIMER(self):
        raise NotImplementedError("red_TIMER is not implemented.")

    def red_PRESS_WALK_BTN(self):
        raise NotImplementedError("red_PRESS_WALK_BTN is not implemented.")

    def red_PRESS_RIGHT_TURN(self):
        raise NotImplementedError("red_PRESS_RIGHT_TURN is not implemented.")

    def green_TIMER(self):
        raise NotImplementedError("green_TIMER is not implemented.")

    def yellow_TIMER(self):
        raise NotImplementedError("yellow_TIMER is not implemented.")

    def greenArrow_TIMER(self):
        raise NotImplementedError("greenArrow_TIMER is not implemented.")

    def yellowArrow_TIMER(self):
        raise NotImplementedError("yellowArrow_TIMER is not implemented.")

    def walk_TIMER(self):
        raise NotImplementedError("walk_TIMER is not implemented.")

    def walk_Event2(self):
        raise NotImplementedError("walk_Event2 is not implemented.")

    def stop_TIMER(self):
        raise NotImplementedError("stop_TIMER is not implemented.")
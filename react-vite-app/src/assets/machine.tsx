import { setup } from "xstate";

/**
 * A single machine that includes:
 *  - Parallel states (`trafficOps` and `pedestrianOps`)
 *  - An inline invoked service for sending TICK events every second
 *  - Actions, guards, and delays
 */
export const machine = setup({
  // 1) Types for context and events
  types: {
    context: {} as {
      counter: number;
      NightProfile: boolean;
    },
    events: {} as
      | { type: "done" }
      | { type: "terminate" }
      | { type: "Error" }
      | { type: "TICK" }
      | { type: "systemReset" }
      | { type: "redTimerExpired" }
      | { type: "vehicleSensor" },
  },

  // 2) Delays for transitions
  delays: {
    TRANSITION_DELAY: 3000, // e.g. 3 seconds
    PEDESTRIAN_DELAY: 2000, // e.g. 2 seconds
  },

  // 3) Actions
  actions: {
    logEnterGreen({ context }) {
      console.log("Entering green state. Counter =", context.counter);
    },
    logExitGreen({ context }) {
      console.log("Exiting green state. Counter =", context.counter);
    },
    incrementCounter({ context }) {
      context.counter++;
      console.log("Counter incremented to", context.counter);
    },
    doThisThatOrTheOther({ context }, params) {
      console.log("Doing something with params:", params);
    },
  },

  // 4) Actors (services) – define an inline “timer” service that sends TICK every second
  actors: {
    timerService: (context, event) => (sendBack) => {
      const id = setInterval(() => {
        sendBack({ type: "TICK" });
      }, 1000);
      // Clean up on exit
      return () => clearInterval(id);
    },
  },

  // 5) Guards (boolean checks for conditional transitions)
  guards: {
    isCounterReached({ context }) {
      // For example, let's say threshold is 5
      return context.counter >= 5;
    },
    isNightProfile({ context }) {
      return context.NightProfile === true;
    },
  },
}).createMachine({
  // 6) Top-level machine config

  id: "expanded-traffic-system",
  description: "Parallel traffic + pedestrian machine with an inline timer service.",
  type: "parallel",
  context: {
    counter: 0,
    NightProfile: false,
  },

  states: {
    ///////////////////////////////////////////////////////////////////////
    // PARALLEL REGION 1: Traffic operations
    ///////////////////////////////////////////////////////////////////////
    trafficOps: {
      description: "Controls main traffic lights, uses an invoked timer service.",
      initial: "green",

      // Invoke the inline timer actor defined above
      invoke: {
        src: "timerService",
      },

      states: {
        green: {
          description: "Green light. Eventually transitions to orange.",
          entry: { type: "logEnterGreen" },
          exit: { type: "logExitGreen" },
          on: {
            done: { target: "orange" },
            terminate: { target: "finished" },
            Error: { target: "Flashing Redish" },
            TICK: {
              // If the counter is reached, jump to orange
              target: "orange",
              actions: { type: "incrementCounter" },
              guard: { type: "isCounterReached" },
            },
          },
          after: {
            TRANSITION_DELAY: {
              target: "orange",
              actions: {
                type: "doThisThatOrTheOther",
                params: { test: 42 },
              },
            },
          },
        },

        orange: {
          description:
            "Orange (amber) light. After a short delay, transitions to red.",
          on: {
            done: { target: "red" },
            terminate: { target: "finished" },
            Error: { target: "Flashing Redish" },
          },
          after: {
            TRANSITION_DELAY: { target: "red" },
          },
        },

        red: {
          description:
            "Red light. Transitions to green if 'NightProfile' is active and vehicleSensor is triggered, or after a timer.",
          on: {
            redTimerExpired: { target: "green" },
            terminate: { target: "finished" },
            Error: { target: "Flashing Redish" },
            vehicleSensor: {
              target: "green",
              guard: { type: "isNightProfile" },
            },
          },
          after: {
            TRANSITION_DELAY: { target: "green" },
          },
        },

        // A shallow history state so we can return to the previous sub-state if needed
        H: {
          type: "history",
          history: "shallow",
        },

        "Flashing Redish": {
          description:
            "Error mode. On systemReset, returns to last known sub-state via 'H'.",
          on: {
            systemReset: { target: "H" },
          },
        },

        finished: {
          type: "final",
          description: "Traffic operations complete.",
        },
      },
    },

    ///////////////////////////////////////////////////////////////////////
    // PARALLEL REGION 2: Pedestrian operations
    ///////////////////////////////////////////////////////////////////////
    pedestrianOps: {
      description: "Cycles between 'walk' and 'dontWalk' signals on a delay.",
      initial: "walk",
      states: {
        walk: {
          after: {
            PEDESTRIAN_DELAY: { target: "dontWalk" },
          },
        },
        dontWalk: {
          after: {
            PEDESTRIAN_DELAY: { target: "walk" },
          },
        },
      },
    },
  },
});

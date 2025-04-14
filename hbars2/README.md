# JSON Machine Schema

This document describes the structure of our JSON-based state machine definition. The JSON represents a [parallel XState machine](https://xstate.js.org/docs/) with multiple nested states, transitions (events, delayed transitions), context values, and references to external code (actors, actions, and guards).

## Top-Level Structure

The top-level JSON object has the following keys:

1. **`id`** (string)  
   A unique identifier for the entire state machine, often mirroring the machine’s name or top-level key (e.g. `"expanded-traffic-system"`).

2. **`type`** (string)  
   The type of the machine, typically `"parallel"` or `"atomic"` (in XState terms).

3. **`description`** (string)  
   A human-readable description of the machine’s overall purpose.

4. **`context`** (object)  
   An initial context object providing default values for any variables or flags used inside the machine (e.g. `"counter": 0` or `"NightProfile": false`).

5. **`states`** (object)  
   This object holds the top-level states by key. For example:
   ```json
   "states": {
     "trafficOps": { ... },
     "pedestrianOps": { ... }
   }
   ```
   Each entry in `states` is itself a **state node** with more detailed configuration.

6. **`implementations`** (object)  
   Houses references to external “implements,” specifically:
   - **`guards`**: boolean-condition functions that appear as transitions’ `guard` attributes.
   - **`actions`**: custom “named actions” invoked during transitions or state entry/exit.
   - **`actors`**: invoked services or “actors” (e.g., a timer service).
   The structure of each sub-key (guards, actions, actors) is further detailed in the sections below.

7. **`schemas`** (object)  
   Describes the schemas for events and potentially other machine interfaces. Typically includes:
   - **`events`**: an object keyed by event name, each with its own properties object.
   - Potential other definitions like `context` or `actors`.

---

## The `states` Object

Under `"states"`, each key is a **state node**. For example:
```json
"states": {
  "trafficOps": { ... },
  "pedestrianOps": { ... }
}
```
Each state node has the following possible fields:

- **`id`** (string): Unique state node identifier.
- **`description`** (string): A brief human-readable description.
- **`initial`** (string): The initial child state (only for compound or parallel states).
- **`type`** (string): e.g. `"parallel"`, `"final"`, or `"history"`.
- **`history`** (string): Typically `"shallow"` or `"deep"` for history states.
- **`invoke`** (array): Zero or more invoked services. Each entry typically has:
  ```json
  {
    "id": "some-service-id",
    "src": "timerService"
  }
  ```
- **`entry`** (array of strings): Named actions to run upon entering the state.
- **`exit`** (array of strings): Named actions to run upon exiting the state.
- **`states`** (object): Nested child states. The structure inside is the same as this one (recursive definition). Each key inside `states` is itself a state node with the same shape.

### Example

```json
"trafficOps": {
  "id": "expanded-traffic-system.trafficOps",
  "description": "Controls main traffic lights...",
  "initial": "green",
  "invoke": [
    {
      "id": "expanded-traffic-system.trafficOps:invocation[0]",
      "src": "timerService"
    }
  ],
  "states": {
    "green": {
      "description": "Green light. Eventually transitions to orange.",
      "entry": [ "logEnterGreen" ],
      "exit": [ "logExitGreen" ],
      "on": { ... },
      "after": { ... }
    },
    "orange": {
      ...
    }
  }
}
```

---

## Transitions: `"on"` and `"after"`

Inside each state, the JSON may define **transitions** via two properties:

1. **`"on"`** (object):  
   Maps event names (e.g. `"TICK"`, `"done"`, `"Error"`) to transitions or an array of transition definitions. Each transition may have:
   - A **`target`** (string) referencing the next state ID.
   - An optional **`guard`** object (e.g. `{"type": "isCounterReached"}`).
   - An optional **`actions`** array describing side effects (e.g. `[{"type": "incrementCounter"}]`).

   ```json
   "on": {
     "TICK": [
       {
         "guard": {
           "type": "isCounterReached"
         },
         "actions": [
           { "type": "incrementCounter" }
         ],
         "target": "orange"
       }
     ]
   }
   ```

2. **`"after"`** (object):  
   Maps delay names (e.g. `"TRANSITION_DELAY"`, `"PEDESTRIAN_DELAY"`) to transitions. The structure is the same as in `"on"` except that events are replaced by after/delay timers. For example:
   ```json
   "after": {
     "TRANSITION_DELAY": [
       {
         "actions": [
           { "type": "doThisThatOrTheOther", "params": { "test": 42 } }
         ],
         "target": "orange"
       }
     ]
   }
   ```

In JSON, we often place a comma right before `"on"` or `"after"` so that it’s a valid property inside the state object, for example:
```json
{
  "description": "Green light",
  "entry": ["logEnterGreen"],
  "exit": ["logExitGreen"],
  "on": { ... },
  "after": { ... }
}
```

---

## `implementations`

The `"implementations"` block contains references to external functions or modules that implement machine features. Each major key breaks down as follows:

```json
"implementations": {
  "guards": {
    "isCounterReached": {
      "id": "isCounterReached",
      "name": "isCounterReached"
    },
    ...
  },
  "actions": {
    "logEnterGreen": {
      "id": "logEnterGreen",
      "name": "logEnterGreen",
      "schema": {
        "type": "object",
        "properties": {}
      }
    },
    ...
  },
  "actors": {
    "timerService": {
      "id": "timerService",
      "name": "expanded-traffic-system.trafficOps:invocation[0]",
      "input": { "type": "object", "properties": {} },
      "output": { "type": "object", "properties": {} }
    },
    ...
  }
}
```

### Guards
A guard is a function used in transitions to conditionally allow or block a transition:
```json
"guard": {
  "type": "isCounterReached"
}
```
Then in `implementations.guards`, you have the full definition:
```json
"isCounterReached": {
  "id": "isCounterReached",
  "name": "isCounterReached"
}
```
(Any additional metadata—like how it’s actually implemented—would be stored separately or in `schema`.)

### Actions
Actions are side effects triggered on entry/exit or during a transition. You reference them by name (e.g. `"logEnterGreen"`). The `schema` key can contain any JSON schema describing parameters.

### Actors
Actors are invoked services such as timers or child machines. Here you have `"timerService"` referencing an external, often code-defined service.

---

## `schemas`

The `"schemas"` block typically describes:

- **`events`**: A dictionary mapping event types (like `"TICK"`, `"Error"`, etc.) to a schema describing any allowed properties in that event.
- **`context`**: A schema for the machine’s context (if desired).  

For example:
```json
"schemas": {
  "events": {
    "TICK": {
      "properties": {}
    },
    "Error": {
      "properties": {}
    }
  }
}
```
This can be used for validation or developer documentation.

---

## Putting It All Together

A typical machine JSON file includes:

- Basic machine metadata (`id`, `type`, `description`)
- An initial `context`
- A hierarchical `states` structure
- Each state’s transitions in `"on"` or `"after"` blocks
- An `implementations` block referencing external code (guards, actions, actors)
- Optionally, a `schemas` block to further define the structure of events or context

### Example Snippet

```json
{
  "id": "expanded-traffic-system",
  "type": "parallel",
  "description": "Parallel traffic + pedestrian machine with an inline timer service.",
  "context": {
    "counter": 0,
    "NightProfile": false
  },
  "states": {
    "trafficOps": {
      "id": "expanded-traffic-system.trafficOps",
      "description": "Controls main traffic lights...",
      "initial": "green",
      "invoke": [
        {
          "id": "expanded-traffic-system.trafficOps:invocation[0]",
          "src": "timerService"
        }
      ],
      "states": {
        "green": {
          "description": "Green light. Eventually transitions to orange.",
          "entry": ["logEnterGreen"],
          "exit": ["logExitGreen"],
          "on": {
            "TICK": [
              {
                "guard": { "type": "isCounterReached" },
                "actions": [{ "type": "incrementCounter" }],
                "target": "orange"
              }
            ]
          },
          "after": {
            "TRANSITION_DELAY": [
              {
                "actions": [
                  { "type": "doThisThatOrTheOther", "params": { "test": 42 } }
                ],
                "target": "orange"
              }
            ]
          }
        },
        ...
      }
    },
    "pedestrianOps": { ... }
  },
  "implementations": {
    "guards": {
      "isCounterReached": {
        "id": "isCounterReached",
        "name": "isCounterReached"
      },
      ...
    },
    "actions": {
      "logEnterGreen": {
        "id": "logEnterGreen",
        "name": "logEnterGreen",
        "schema": {
          "type": "object",
          "properties": {}
        }
      },
      ...
    },
    "actors": {
      "timerService": {
        "id": "timerService",
        "name": "expanded-traffic-system.trafficOps:invocation[0]",
        "input": {
          "type": "object",
          "properties": {}
        },
        "output": {
          "type": "object",
          "properties": {}
        }
      }
    }
  },
  "schemas": {
    "events": {
      "TICK": {
        "properties": {}
      },
      "Error": {
        "properties": {}
      }
    }
  }
}
```

This example ties together the typical structure for an XState-based JSON representation.  

---

## Conclusion

This JSON structure encodes:

1. **Machine metadata** (ID, description, context).  
2. **Hierarchical states** (with child `states` objects).  
3. **Transition definitions** via `"on"` (event-based) and `"after"` (delay-based).  
4. **References** to external code or logic in `implementations` (guards, actions, actors).  
5. **Event schemas** and other validations in `schemas`.

Armed with these details, you can confidently generate or parse this JSON—via Handlebars or any templating/library approach—to build other artifacts (like TypeScript code, UML diagrams, or XState-compatible definitions).
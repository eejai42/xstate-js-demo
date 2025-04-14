## expanded-traffic-system
> Parallel traffic + pedestrian machine with an inline timer service.

## expanded-traffic-system.trafficOps
> Controls main traffic lights, uses an invoked timer service.

**Invoke** from source `timerService` (ID: `expanded-traffic-system.trafficOps:invocation[0]`) 

## expanded-traffic-system.trafficOps.green
> Green light. Eventually transitions to orange.

**On entry:**
- **Do** `logEnterGreen` 

**On** `done`:

- **Transition** to [expanded-traffic-system.trafficOps.orange](#expandedtrafficsystemtrafficopsorange)

**On** `terminate`:

- **Transition** to [expanded-traffic-system.trafficOps.finished](#expandedtrafficsystemtrafficopsfinished)

**On** `Error`:

- **Transition** to [expanded-traffic-system.trafficOps.Flashing Redish](#expandedtrafficsystemtrafficopsflashing-redish)

**On** `TICK` if `isCounterReached`:

- **Do** `incrementCounter` 
- **Transition** to [expanded-traffic-system.trafficOps.orange](#expandedtrafficsystemtrafficopsorange)

**On** `xstate.after(TRANSITION_DELAY)#expanded-traffic-system.trafficOps.green`:

- **Do** `doThisThatOrTheOther` with params: 
  - `test`: `42`
- **Transition** to [expanded-traffic-system.trafficOps.orange](#expandedtrafficsystemtrafficopsorange)

**On exit:**
- **Do** `logExitGreen` 


## expanded-traffic-system.trafficOps.orange
> Orange (amber) light. After a short delay, transitions to red.

**On** `done`:

- **Transition** to [expanded-traffic-system.trafficOps.red](#expandedtrafficsystemtrafficopsred)

**On** `terminate`:

- **Transition** to [expanded-traffic-system.trafficOps.finished](#expandedtrafficsystemtrafficopsfinished)

**On** `Error`:

- **Transition** to [expanded-traffic-system.trafficOps.Flashing Redish](#expandedtrafficsystemtrafficopsflashing-redish)

**On** `xstate.after(TRANSITION_DELAY)#expanded-traffic-system.trafficOps.orange`:

- **Transition** to [expanded-traffic-system.trafficOps.red](#expandedtrafficsystemtrafficopsred)


## expanded-traffic-system.trafficOps.red
> Red light. Transitions to green if 'NightProfile' is active and vehicleSensor is triggered, or after a timer.

**On** `redTimerExpired`:

- **Transition** to [expanded-traffic-system.trafficOps.green](#expandedtrafficsystemtrafficopsgreen)

**On** `terminate`:

- **Transition** to [expanded-traffic-system.trafficOps.finished](#expandedtrafficsystemtrafficopsfinished)

**On** `Error`:

- **Transition** to [expanded-traffic-system.trafficOps.Flashing Redish](#expandedtrafficsystemtrafficopsflashing-redish)

**On** `vehicleSensor` if `isNightProfile`:

- **Transition** to [expanded-traffic-system.trafficOps.green](#expandedtrafficsystemtrafficopsgreen)

**On** `xstate.after(TRANSITION_DELAY)#expanded-traffic-system.trafficOps.red`:

- **Transition** to [expanded-traffic-system.trafficOps.green](#expandedtrafficsystemtrafficopsgreen)


## expanded-traffic-system.trafficOps.H



## expanded-traffic-system.trafficOps.Flashing Redish
> Error mode. On systemReset, returns to last known sub-state via 'H'.

**On** `systemReset`:

- **Transition** to [expanded-traffic-system.trafficOps.H](#expandedtrafficsystemtrafficopsh)


## expanded-traffic-system.trafficOps.finished
> Traffic operations complete.



## expanded-traffic-system.pedestrianOps
> Cycles between 'walk' and 'dontWalk' signals on a delay.

## expanded-traffic-system.pedestrianOps.walk
**On** `xstate.after(PEDESTRIAN_DELAY)#expanded-traffic-system.pedestrianOps.walk`:

- **Transition** to [expanded-traffic-system.pedestrianOps.dontWalk](#expandedtrafficsystempedestrianopsdontwalk)


## expanded-traffic-system.pedestrianOps.dontWalk
**On** `xstate.after(PEDESTRIAN_DELAY)#expanded-traffic-system.pedestrianOps.dontWalk`:

- **Transition** to [expanded-traffic-system.pedestrianOps.walk](#expandedtrafficsystempedestrianopswalk)


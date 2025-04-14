## expanded-traffic-system
> Parallel traffic + pedestrian machine with an inline timer service.
## expanded-traffic-system.trafficOps.trafficOps
> Controls main traffic lights, uses an invoked timer service.
**Invoke** from source `timerService` (ID: `expanded-traffic-system.trafficOps:invocation[0]`) 
## undefined...green
> Green light. Eventually transitions to orange.
**On entry:**
- **Do** `logEnterGreen` 
**On** `done`
:
- **Transition** to [expanded-traffic-system.trafficOps.orange](#expandedtrafficsystemtrafficopsorange)
**On** `terminate`
:
- **Transition** to [expanded-traffic-system.trafficOps.finished](#expandedtrafficsystemtrafficopsfinished)
**On** `Error`
:
- **Transition** to [expanded-traffic-system.trafficOps.Flashing Redish](#expandedtrafficsystemtrafficopsflashingredish)
**On** `TICK`
 if `isCounterReached`
:
- **Do** `incrementCounter`
- **Transition** to [expanded-traffic-system.trafficOps.orange](#expandedtrafficsystemtrafficopsorange)
**On** `xstate.after(TRANSITION_DELAY)#.`
:
- **Do** `doThisThatOrTheOther`
  - `test`: `42`
- **Transition** to [expanded-traffic-system.trafficOps.orange](#expandedtrafficsystemtrafficopsorange)
**On exit:**
- **Do** `logExitGreen` 
## undefined...orange
> Orange (amber) light. After a short delay, transitions to red.
**On** `done`
:
- **Transition** to [expanded-traffic-system.trafficOps.red](#expandedtrafficsystemtrafficopsred)
**On** `terminate`
:
- **Transition** to [expanded-traffic-system.trafficOps.finished](#expandedtrafficsystemtrafficopsfinished)
**On** `Error`
:
- **Transition** to [expanded-traffic-system.trafficOps.Flashing Redish](#expandedtrafficsystemtrafficopsflashingredish)
**On** `xstate.after(TRANSITION_DELAY)#.`
:
- **Transition** to [expanded-traffic-system.trafficOps.red](#expandedtrafficsystemtrafficopsred)
## undefined...red
> Red light. Transitions to green if 'NightProfile' is active and vehicleSensor is triggered, or after a timer.
**On** `redTimerExpired`
:
- **Transition** to [expanded-traffic-system.trafficOps.green](#expandedtrafficsystemtrafficopsgreen)
**On** `terminate`
:
- **Transition** to [expanded-traffic-system.trafficOps.finished](#expandedtrafficsystemtrafficopsfinished)
**On** `Error`
:
- **Transition** to [expanded-traffic-system.trafficOps.Flashing Redish](#expandedtrafficsystemtrafficopsflashingredish)
**On** `vehicleSensor`
 if `isNightProfile`
:
- **Transition** to [expanded-traffic-system.trafficOps.green](#expandedtrafficsystemtrafficopsgreen)
**On** `xstate.after(TRANSITION_DELAY)#.`
:
- **Transition** to [expanded-traffic-system.trafficOps.green](#expandedtrafficsystemtrafficopsgreen)
## undefined...H
## undefined...Flashing Redish
> Error mode. On systemReset, returns to last known sub-state via 'H'.
**On** `systemReset`
:
- **Transition** to [expanded-traffic-system.trafficOps.H](#expandedtrafficsystemtrafficopsh)
## undefined...finished
> Traffic operations complete.
## expanded-traffic-system.pedestrianOps.pedestrianOps
> Cycles between 'walk' and 'dontWalk' signals on a delay.
## undefined...walk
**On** `xstate.after(PEDESTRIAN_DELAY)#.`
:
- **Transition** to [expanded-traffic-system.pedestrianOps.dontWalk](#expandedtrafficsystempedestrianopsdontwalk)
## undefined...dontWalk
**On** `xstate.after(PEDESTRIAN_DELAY)#.`
:
- **Transition** to [expanded-traffic-system.pedestrianOps.walk](#expandedtrafficsystempedestrianopswalk)

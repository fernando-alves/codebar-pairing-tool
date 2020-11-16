import React from 'react'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {useDispatch, useSelector} from 'react-redux'
import {DraggableType} from '../../../config/dnd'
import {reviewAttendeesAgain} from '../attendees/attendeesSlice'
import {selectAvailableCoaches, selectAvailableStudents, selectPairingGroups} from './pairingsSlice'
import {AttendeeCompactCard} from './dragAndDrop/AttendeeCompactCard'
import {DraggableName} from './dragAndDrop/DraggableName'
import {StudentDropzone} from './dragAndDrop/StudentDropzone'
import {CoachDropzone} from './dragAndDrop/CoachDropzone'
import Button from '@material-ui/core/Button'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import './PairingsStep.scss'

export const PairingsStep = () => {
  const availableStudents = useSelector(selectAvailableStudents)
  const availableCoaches = useSelector(selectAvailableCoaches)
  const groups = useSelector(selectPairingGroups)
  const dispatch = useDispatch()

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='PairingsStep'>
        <div className='PairingsStepHeader'>
          <span>Step 3: Start organising the pairs by dragging the names of the participants to groups</span>
          <Button
            className='PairingsStepBack'
            variant='contained'
            color='primary'
            startIcon={<SkipPreviousIcon/>}
            onClick={() => dispatch(reviewAttendeesAgain())}
          >
            Review attendance and skills
          </Button>
        </div>
        <div className='PairingsStepContent'>

          <div className='Attendees'>
            <h4>Students</h4>
            <StudentDropzone groupId={0}>
              {availableStudents.map(student => <AttendeeCompactCard data={student} type={DraggableType.STUDENT}/>)}
              {availableStudents.length === 0 && <span>Drag a student here</span>}
            </StudentDropzone>
            <h4>Coaches</h4>
            <CoachDropzone groupId={0}>
              {availableCoaches.map(coach => <AttendeeCompactCard data={coach} type={DraggableType.COACH}/>)}
              {availableCoaches.length === 0 && <span>Drag a coach here</span>}
            </CoachDropzone>
          </div>

          <div className='Pairs'>
            <h4>Pairs</h4>
            {groups.map(group =>
              <div className='PairingGroup'>
                <StudentDropzone groupId={group.id}>
                  {group.students.length > 0 && group.students.map(student => <DraggableName attendee={student} type={DraggableType.STUDENT}/>)}
                  {group.students.length <= 0 && <span>Drag a student here</span>}
                </StudentDropzone>
                <CoachDropzone groupId={group.id}>
                  {group.coaches.length > 0 && group.coaches.map(coach => <DraggableName attendee={coach} type={DraggableType.COACH}/>)}
                  {group.coaches.length <= 0 && <span>Drag a coach here</span>}
                </CoachDropzone>
              </div>
            )}
          </div>

        </div>
      </div>
    </DndProvider>
  )
}

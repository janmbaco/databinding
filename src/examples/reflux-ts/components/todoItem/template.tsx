/** @jsx el */
import { el } from '../../virtualDom';
import { connect } from '../../connect';
import { className as cn } from '../../utils';
import { selectLabelTitle, selectCurrentItem, selectEditTitle } from './';
import { Actions } from '../';
import { bindActions } from '../../bindActions';


const ENTER_KEY = 13;
export const ESC_KEY = 27;

function mapStateToProps(state, props) {
    const newState = {
        ...props,
        labelTitle: selectLabelTitle(props),
        editTitle: selectEditTitle(props),
        ...selectCurrentItem(state)
    };
    return {
        ...newState,
        errors: {
            main: newState.error,
            todos: state.todos && state.todos.error
        }
    };
}

function mapDispatchToProps(dispatch, props) {
    const actions = bindActions(Actions, dispatch);
    return {
        dispatch: dispatch,
        ...actions,
        updateOnEnter(evnt, itemId) {
            if (evnt.which === ENTER_KEY) {
                actions.uiUpdateTodoTitle(itemId);
                actions.uiSetCurrentItem(null);
            }
        },
        revertOnEscape(e) {
            if (e.which === ESC_KEY) {
                actions.uiSetCurrentItem(null);
                //this.cancelChanges();
            }
        }
    };
}

export const TodoListViewItem = connect(mapStateToProps, mapDispatchToProps)(({ dispatch, ...props } = {

} as ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>) => <div className={cn(
    'table-view-cell', 'media', 'completed?', 'editing?', 'hidden?',
    props.completed, props.currentItemId, props.hidden
)}>
        <span className="media-object pull-left" style={"display: inline-block;" as any}>
            <input id={`view-${props.id}`} className="hidden" type="checkbox"
                checked={props.complete}
                onChange={e => props.setCompleted(props.id, e.target['checked'])}
            />
        </span>
        <span className="input-group" style={"display: inline-block; width: 70%;" as any}>
            {props.currentItemId === props.id || <label className="view input" style={"padding: 1px 1px 1px 1px;" as any}
                onClick={e => props.uiSetCurrentItem(props.id)}
            >{props.labelTitle}</label>}
            {props.currentItemId === props.id && <div className="edit" style={"border: 1px solid grey;outline: none;" as any}
                contentEditable={true}
                onInput={e => props.uiUpdateEditingTitle(e.target['innerText'])}
                onKeyPress={e => props.updateOnEnter(e, props.currentItemId)}
                onKeyUp={e => props.revertOnEscape(e)}
                onBlur={e =>props.uiSetCurrentItem(null)}
            >{props.editTitle}</div>}
        </span>
        <button className="destroy btn icon icon-trash"
            onClick={e => props.clear()}
            style={"display: inline-block;" as any}
        >Delete</button>
    </div>
);

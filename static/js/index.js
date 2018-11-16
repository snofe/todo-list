class AddTask extends React.Component {
    state = {
        text: ''
    };

    onBtnClickHandler = (e) => {
        e.preventDefault();
        const {text} = this.state;
        if (!text) {
            alert('Задание не может быть пустым');
        }
        else {
            let action = 'add'
            this.props.handleTask({text}, {action});
            this.setState({ text: '' })
        }
    };

    handleTextChange = (e) => {
        this.setState({ text: e.currentTarget.value })
    };

    render() {
        const {text} = this.state;
        return (
            <div className="task_add rounded">
                <form>
                    <textarea maxLength="240" className='text_add' onChange={this.handleTextChange} value={text}></textarea>
                    <div className="buttons float-right">
                        <div className="button"><input type="submit" className="btn btn-primary" onClick={this.onBtnClickHandler} value="Добавить"/></div>
                    </div>
                </form>
            </div>
        )
    }
}


class Task extends React.Component {
    state = {
        change: false,
        text: this.props.data.text
    };

    compBtn = (e) => {
        e.preventDefault();
        let id = this.props.id;
        let action = 'complete';
        this.props.handleTask({id},{action})
    };

    delBtn = (e) => {
        e.preventDefault();
        let id = this.props.id;
        let action = 'delete';
        this.props.handleTask({id},{action})
    };

    changeText = (e) => {
        e.preventDefault();
        if (this.state.change) {
            if (!this.state.text) {
                alert('Заполните текст задания');
            } else {
                this.setState({change: false});
                let id = this.props.id;
                let text = this.state.text;
                let action = 'change';
                this.props.handleTask({id, text},{action})
            }
        } else {
            this.setState({change: true})
        }
    }

    handleTextChange = (e) => {
        this.setState({ text: e.currentTarget.value })
    };

    render () {
        const { completed } = this.props.data;
        const { text } = this.state;
        return (
            <div className={completed ? "task_comp rounded" : "task_uncomp rounded"}>
                {!this.state.change ?
                    <div className="text">
                        {text}
                    </div>
                    :
                    <div className="text">
                        <textarea maxLength="240" className={!completed ? "textChange_uncomp": "textChange_comp"} onChange={this.handleTextChange} defaultValue={text}></textarea>
                    </div>
                }
                <div className="buttons float-right">
                    {(completed && this.state.change) && <div className="button"><input type="button" className="btn btn-warning" onClick={this.compBtn} value="Вернуть"/></div>}
                    {(!completed && !this.state.change) && <div className="button"><input type="button" className="btn btn-success" onClick={this.compBtn} value="Выполнить"/></div>}
                    <div className="button"><input type="button" className="btn btn-primary" onClick={this.changeText} value={this.state.change ? 'Применить' : 'Изменить'}/></div>
                    <div className="button"><input type="button" className="btn btn-danger" onClick={this.delBtn} value="Удалить"/></div>
                </div>
            </div>
        )
    }
}

class Todolist extends React.Component {
    constructor(props) {
        super(props);
    }

    renderTasks = () => {
        const { data } = this.props;
        let handleTask = this.props.handleTask;
        let taskTemplate = null;
        if (data != null) {
            taskTemplate = data.reverse().map(function (item) {
                return <Task key={item.id} id={item.id} data={item} handleTask={handleTask}/>
            })
        } else {
            taskTemplate = <p>Loading</p>
        }
        return taskTemplate
          };

    render () {
        return (
            <div>
                {this.renderTasks()}
            </div>
        )
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: null
        };

        this.handleTask = this.handleTask.bind(this);
    }

    componentDidMount() {
        fetch('/task')
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.setState({tasks: data})
            })
    }

    handleTask = (data, action) => {
        fetch('/task', {
            method: 'POST',
            body: JSON.stringify({action, data})
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.setState({tasks: data})
            })
    };


    render() {
        return (
            <React.Fragment>
                <AddTask handleTask={this.handleTask}/>
                <Todolist data={this.state.tasks} handleTask={this.handleTask}/>
            </React.Fragment>
        )
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('tasks')
);



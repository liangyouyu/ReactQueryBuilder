import '../lib/index.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import QueryBuilder from '../lib/index.jsx';


const fields = [
    {name: 'firstName', label: 'First Name'},
    {name: 'lastName', label: 'Last Name'},
    {name: 'age', label: 'Age'},
    {name: 'address', label: 'Address'},
    {name: 'phone', label: 'Phone'},
    {name: 'email', label: 'Email'},
    {name: 'twitter', label: 'Twitter'},
    {name: 'isDev', label: 'Is a Developer?', value: false},
];
const defaultValue =  {
    "combinator": "or",
    "not":false,
    "rules": [
        {
            "field": "firstName",
            "operator": "=",
            "value": "2222"
        },
        {
            "combinator": "and",
            "not": true,
            "rules": [
                {
                    "field": "age",
                    "operator": "=",
                    "value": 77
                }
            ]
        }
    ]
};

class QueryBuilderWrapper extends React.Component {
    constructor() {
        super();
        this.state = {
            query: {}
        };
    }

    render() {
        return (
            <div className="flex-box">
                <div className="scroll">
                    {
                        fields ?
                            <QueryBuilder
                                fields={this.props.fields}
                                defaultValue={defaultValue}
                                getEditor={this.getEditor}
                                onQueryChange={this.logQuery.bind(this)}/>
                            :<div />
                    }
                </div>
                <div className="shrink query-log scroll">
                    <h4>Query</h4>
                    <pre>{JSON.stringify(this.state.query, null, 2)}</pre>
                </div>
            </div>
        );
    }

    getEditor({field, operator, value,fields, onChange}) {
        if (field !== 'isDev' || operator !== '=') {
            return null;
        }

        const hasValue = !!value;
        return (
            <span>
            <input type="checkbox"
                   value={hasValue}
                   onChange={event=>onChange(event.target.checked)}/>
        </span>
        );
    }

    logQuery(query) {
        this.setState({query});
    }


}
ReactDOM.render(<QueryBuilderWrapper fields={fields} />,document.getElementById('app'));
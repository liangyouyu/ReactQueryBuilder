import React from 'react'
import uniqueId from 'lodash/uniqueId';
import RuleGroup from './RuleGroup.jsx';

export default class QueryBuilder extends React.Component {
    static get defaultProps() {
        return {
            query: null,
            fields: [],
            operators: QueryBuilder.defaultOperators,
            combinators: QueryBuilder.defaultCombinators,
            nots: QueryBuilder.defaultNot,
            getEditor: null,
            getOperators: null,
            onQueryChange: null,
            controlClassnames: null,
            defaultValue: null,
        }
    }

    static get propTypes() {
        return {
            query: React.PropTypes.object,
            fields: React.PropTypes.array.isRequired,
            operators: React.PropTypes.array,
            combinators: React.PropTypes.array,
            nots: React.PropTypes.array,
            getEditor: React.PropTypes.func,
            getOperators: React.PropTypes.func,
            onQueryChange: React.PropTypes.func,
            controlClassnames: React.PropTypes.object,
            defaultValue: React.PropTypes.object,
        };
    }


    constructor(...args) {
        super(...args);
        this.state = {
            root: {},
            schema: {},
        };
    }

    static get defaultOperators() {

        return [
            {name: 'null', label: 'Is Null'},
            {name: 'notNull', label: 'Is Not Null'},
            {name: 'in', label: 'In'},
            {name: 'notIn', label: 'Not In'},
            {name: '=', label: '='},
            {name: '!=', label: '!='},
            {name: '<', label: '<'},
            {name: '>', label: '>'},
            {name: '<=', label: '<='},
            {name: '>=', label: '>='},
        ];
    }

    static get defaultCombinators() {

        return [
            {name: 'and', label: 'AND'},
            {name: 'or', label: 'OR'},
        ];
    }

    static get defaultNot() {

        return [
            {name: 'not', label: 'NOT'},
        ];
    }

    static get defaultControlClassnames() {
        return {
            queryBuilder: '',

            ruleGroup: '',
            combinators: '',
            nots: '',
            addRule: '',
            addGroup: '',
            removeGroup: '',

            rule: '',
            fields: '',
            operators: '',
            value: '',
            removeRule: '',

        };
    }

    componentWillMount() {
        const {fields, operators, combinators,nots, controlClassnames,defaultValue} = this.props;
        const classNames = Object.assign({}, QueryBuilder.defaultControlClassnames, controlClassnames);

        this.setState({
            root: this.getInitialQuery(),
            schema: {
                fields,
                operators,
                combinators,
                nots,
                defaultValue,
                classNames,
                createRule: this.createRule.bind(this),
                createRuleGroup: this.createRuleGroup.bind(this),
                onRuleAdd: this._notifyQueryChange.bind(this, this.onRuleAdd),
                onGroupAdd: this._notifyQueryChange.bind(this, this.onGroupAdd),
                onRuleRemove: this._notifyQueryChange.bind(this, this.onRuleRemove),
                onGroupRemove: this._notifyQueryChange.bind(this, this.onGroupRemove),
                onPropChange: this._notifyQueryChange.bind(this, this.onPropChange),
                isRuleGroup: this.isRuleGroup.bind(this),
                getEditor: (...args)=>this.prepareEditor(...args),
                getOperators: (...args)=>this.getOperators(...args),
            }
        });

    }

    getInitialQuery() {
        return this.props.query || this.createRuleGroup();
    }

    componentDidMount() {
        this.setRules();
        this._notifyQueryChange(null);
    }

    render() {
        const {root: {id, rules, combinator,not}, schema} = this.state;

        return (
            <div className={`queryBuilder ${schema.classNames.queryBuilder}`}>
                <RuleGroup rules={rules}
                           combinator={combinator}
                           not={not}
                           schema={schema}
                           id={id}
                           parentId={null}/>
            </div>
        );
    }

    //设置默认数据
    setRules(data) {
        data = (data ? data : this.state.schema.defaultValue);
        if (Array.isArray(data)) {
            data = {
                combinator: "and",
                not:false,
                rules: data
            };
        }

        if (!data || !data.rules || (data.rules.length === 0)) {
            console.error('RulesParse', 'Incorrect data object passed');
            return;
        }

        const  {root} = this.state;

        // this.onPropChange('combinator', "or", id);
        // const newRule = this.createRule();
        // this.onRuleAdd(newRule, id);
        // this.onPropChange("field","age",newRule.id);
        // this.onPropChange("value","999",newRule.id);
        // const newGroup = this.createRuleGroup();
        // this.onGroupAdd(newGroup, id);
        // this.onPropChange('combinator', "or", newGroup.id);


        var self = this;

        (function add(data, group) {
            if (group === null) {
                return;
            }
            if (data.combinator === undefined) {
                data.combinator = "and";
            }
            if (data.not === undefined) {
                data.not = false;
            }
            group.combinator = data.combinator;
            group.not = data.not;
            data.rules.forEach(function(item) {
                var model;
                //ruleGroup
                if (item.rules !== undefined) {
                    model = self.createRuleGroup();
                    self.onGroupAdd(model, group.id);
                    if (item.combinator === undefined) {
                        item.combinator = "and";
                    }
                    if (data.not === undefined) {
                        data.not = false;
                    }
                    self.onPropChange('combinator', item.combinator, model.id);
                    self.onPropChange('not', item.not, model.id);
                    add(item, model);
                }
                //rule
                else {
                    model = self.createRule();
                    self.onRuleAdd(model, group.id);
                    self.onPropChange("field",item.field,model.id);
                    self.onPropChange("operator",item.operator,model.id);
                    self.onPropChange("value",item.value,model.id);
                }
            });

        }(data, root));
    };

    isRuleGroup(rule) {
        return !!(rule.combinator && rule.rules);
    }

    createRule() {
        const {fields, operators} = this.state.schema;

        return {
            id: uniqueId('r-'),
            field: fields[0].name,
            value: '',
            operator: operators[0].name
        };
    }

    createRuleGroup() {
        return {
            id: uniqueId('g-'),
            rules: [],
            combinator: this.props.combinators[0].name,
            not:false,
        };
    }


    prepareEditor(config) {
        const {value, operator, onChange} = config;

        const editor = this.props.getEditor && this.props.getEditor(config);
        if (editor) {
            return editor;
        }

        if (operator === 'null' || operator === 'notNull') {
            return null;
        }

        return (
            <input type="text"
                   value={value}
                   onChange={event=>onChange(event.target.value)}/>
        );
    }

    getOperators(field) {
        if (this.props.getOperators) {
            const ops = this.props.getOperators(field);
            if (ops) {
                return ops;
            }
        }


        return QueryBuilder.defaultOperators;
    }

    onRuleAdd(rule, parentId) {
        const parent = this._findRule(parentId, this.state.root);
        parent.rules.push(rule);

        this.setState({root: this.state.root});
    }

    onGroupAdd(group, parentId) {
        const parent = this._findRule(parentId, this.state.root);
        parent.rules.push(group);

        this.setState({root: this.state.root});
    }

    onPropChange(prop, value, ruleId) {
        const rule = this._findRule(ruleId, this.state.root);
        Object.assign(rule, {[prop]: value});

        this.setState({root: this.state.root});
    }

    onRuleRemove(ruleId, parentId) {
        const parent = this._findRule(parentId, this.state.root);
        const index = parent.rules.findIndex(x=>x.id === ruleId);

        parent.rules.splice(index, 1);
        this.setState({root: this.state.root});
    }

    onGroupRemove(groupId, parentId) {
        const parent = this._findRule(parentId, this.state.root);
        const index = parent.rules.findIndex(x=>x.id === groupId);

        parent.rules.splice(index, 1);
        this.setState({root: this.state.root});
    }

    _findRule(id, parent) {
        const {isRuleGroup} = this.state.schema;

        if (parent.id === id) {
            return parent;
        }

        for (const rule of parent.rules) {
            if (rule.id === id) {
                return rule;
            } else if (isRuleGroup(rule)) {
                const subRule = this._findRule(id, rule);
                if (subRule) {
                    return subRule;
                }
            }
        }

    }

    _notifyQueryChange(fn, ...args) {
        if (fn) {
            fn.call(this, ...args);
        }

        const {onQueryChange} = this.props;
        if (onQueryChange) {
            const query = this._constructQuery(this.state.root);
            onQueryChange(query);
        }
    }

    _constructQuery(node) {
        let query;
        const {isRuleGroup} = this.state.schema;

        if (isRuleGroup(node)) {
            const {combinator,not, rules} = node;
            query = {
                combinator,
                not,
                rules: rules.map(r=> this._constructQuery(r, {}))
            };
        } else {
            const {field, operator, value} = node;
            query = {field, operator, value};
        }

        return query;
    }
}
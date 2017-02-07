var Table = React.createClass({
    render () {
        return (
            <table>
                <tr>
                    <th> Nome </th>
                    <th> Descrição </th>
                </tr>
                <Item name="Scope" desc="Usado para medir sinais no tempo"/>
                <Item name="Multi" desc="Usado para medir grandezas"/>
            </table>
        );
    }
});

var Item = React.createClass({
    render () {
        return (
            <tr>
                <td> {this.props.name} </td>
                <td> {this.props.desc} </td>
            </tr>
        );
    }
});

ReactDOM.render(
    <Table />,
    document.getElementById('content')
);

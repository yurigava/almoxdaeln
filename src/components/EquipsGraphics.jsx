import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';
import {Doughnut, HorizontalBar, Bar} from 'react-chartjs-2';

const dataBar = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [6, 5, 4, 3, 2, 1, 1]
    }
  ]
};

const style = {
  verticalAlign: 'bottom',
  margin: 1,
  display: "inline-block",
  color: 'black',
  width: '10%',
};

export default class EquipsGraphics extends React.Component {

  render () {
    return (
      <div>
        <Bar
          data={dataBar}
          //width={10}
          //height={5}
          options={{
            maintainAspectRatio: false
          }}
          style={style}
        />
        
      </div>
    )
  }
}

EquipsGraphics.propTypes = {
};

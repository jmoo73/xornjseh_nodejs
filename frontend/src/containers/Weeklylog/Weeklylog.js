import React, { Component } from 'react';
import { connect } from 'react-redux';
import WeeklyLogTableTable from '../../components/WeeklyData/WeeklyLogTableTable';
import Spinner from '../../components/UI/Spinner/Spinner';
import axInstance from '../../shared/axios-orders';

class Weeklylog extends Component {
   state = {
      statsTable: {}, // { Monday: [ [ 1, 2, 3, 0, ... ], ... ], ... }
      loading: true,
   };

   async componentDidMount() {
      const response = await axInstance.post('/gglStats/weekly-table', {
         statsGglID: this.props.statsGglID,
         locationID: this.props.locationID,
         keyList: this.props.keyList,
      });
      this.setState({ statsTable: response.data.statsTable, loading: false });
   }

   render() {
      return (
         <React.Fragment>
            <div>
               {this.state.loading ? (
                  <Spinner />
               ) : (
                  <WeeklyLogTableTable
                     keyList={this.props.keyList}
                     statsTable={this.state.statsTable}
                     classTable={this.props.classNameTable}
                  />
               )}
            </div>
         </React.Fragment>
      );
   }
}

const mapStateToProps = state => {
   return {
      // [ 'Afterschool', .... 'Class6' ]
      keyList: state.stats.keyList,
      // { Monday: [ 'Tiger Tot', 'White and Yellow', ... ], ... ], ... }
      classNameTable: state.ggl.classNameTable,
      statsGglID: state.auth.statsGglID,
      locationID: state.auth.locationID,
   };
};

export default connect(mapStateToProps)(Weeklylog);

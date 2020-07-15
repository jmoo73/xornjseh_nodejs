import React, { Component } from 'react';
import classes from './TimeBar.module.css';

class TimeBar extends Component {
   state = {
      H: null,
      M: null,
      S: null,
      meridiem: null,
   };
   tick = () => {
      const meri = hour => {
         if (hour > 11)
            return { h: hour - 12 === 0 ? 12 : hour - 12, meridiem: 'PM' };
         else return { h: hour, meridiem: 'AM' };
      };

      const now = new Date();
      const merid = meri(now.getHours());
      this.setState({ H: merid.h < 10 ? '0' + merid.h : merid.h });
      const m = now.getMinutes();
      this.setState({ M: m < 10 ? '0' + m : m });
      const s = now.getSeconds();
      this.setState({ S: s < 10 ? '0' + s : s });
      this.setState({ meridiem: merid.meridiem });
   };

   componentDidMount() {
      this.interval = setInterval(this.tick, 1000);
   }

   componentWillUnmount() {
      clearInterval(this.interval);
   }

   render() {
      return (
         <React.Fragment>
            <div className={classes.clock}>
               {this.state.H}
               {' : '}
               {this.state.M}
               {' : '}
               {this.state.S} {this.state.meridiem}
            </div>
         </React.Fragment>
      );
   }
}

export default TimeBar;

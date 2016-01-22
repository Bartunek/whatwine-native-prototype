/**
 * Draws numbers in a nice fancy graph, optionaly with animation
 */
import React, { PropTypes } from 'react';
import ReactStateAnimation from 'react-state-animation';

export default class ScoreGraph extends React.Component {

  static propTypes = {
    score: PropTypes.number,
    label: PropTypes.number,
    width: PropTypes.number,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string,
    showText: PropTypes.bool,
    unit: PropTypes.string,
    textRatio: PropTypes.number,
    animate: PropTypes.bool,
    animTime: PropTypes.number
  };

  static defaultProps = {
    score: 0,
    width: 100,
    strokeWidth: 4,
    stroke: '#fff',
    showText: true,
    unit: '%',
    textRatio: 0.6,
    animate: false,
    animTime: 1000
  };

  constructor(props) {
    super(props);

    const sw = Math.round(this.props.strokeWidth / 2);
    // Use state just for handling internal stuff, animations, computations, etc.
    this.state = {
      // Half of stroke width to fit circle or arc precisely in square
      sw: sw,
      // Radius
      r: (this.props.width / 2) - sw,
      // Circumference of full circle used to compute angle
      length: (this.props.width - this.props.strokeWidth) * Math.PI,
      score: 0,
      label: this.props.label || 0
    };
    this._animate = new ReactStateAnimation(this);
  }

  // Don't animate, just set proper values to render
  componentWillMount() {
    if (!this.props.animate) {
      this.setState({
        score: this.props.score,
        label: this.props.label || this.props.score
      });
    }
  }

  // Animate circle through state
  componentDidMount() {
    if (this.props.animate) {
      this._animate.easeOutCubic('score', this.props.score, this.props.animTime);
    }
  }

  // Reset circle to zero, as preparation for animation to new value
  componentWillReceiveProps(nextProps) {
    if (this.props.animate && this.props.score !== nextProps.score) {
      this.setState({
        score: 0,
        label: nextProps.label || nextProps.score
      });
    }
  }

  // If animation is enabled and score was updated, animate through state
  componentDidUpdate(prevProps) {
    if (this.props.animate && this.props.score !== prevProps.score) {
      this._animate.easeOutCubic('score', this.props.score, this.props.animTime);
    }
  }

  getTextStyle() {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      color: this.props.stroke,
      fontSize: Math.round(this.state.r * this.props.textRatio) + 'px',
      lineHeight: this.props.width + 'px',
      textAlign: 'center'
    };
  }

  getDivStyle() {
    return {
      position: 'relative',
      width: this.props.width + 'px',
      height: this.props.width + 'px'
    };
  }

  // Create background circle only if value circle is not fully filled
  renderBgCircle() {
    const {r, sw} = this.state;
    return this.state.score < 100 ? (
      <circle cx={r + sw} cy={r + sw} r={r}
        stroke={this.props.stroke}
        strokeWidth={this.props.strokeWidth + 'px'}
        strokeOpacity="0.25"
        fill="none" />
    ) : false;
  }

  renderValueCircle() {
    // Render nothing for zero value
    if (this.state.score === 0) {
      return false;
    }
    // Use circle element for full score
    if (this.state.score === 100) {
      return (
        <circle
          cx={this.state.r + this.state.sw}
          cy={this.state.r + this.state.sw} r={this.state.r}
          stroke={this.props.stroke}
          strokeWidth={this.props.strokeWidth + 'px'}
          fill="none" />
      );
    }
    // Get some values needed for computation
    const {r, sw, length} = this.state;
    // Angle in radians
    const angle = (length / 100 * this.state.score) / r;
    // X and Y coords of end point of arc
    const x = ( Math.sin(angle) *  r ) + r + sw;
    const y = ( Math.cos(angle) * -r ) + r + sw;
    // Determine the sweepFlag value for path
    const sweep = this.state.score < 50 ? 0 : 1;
    // Create path definition for SVG <path> element
    const path = `M ${r + sw} ${sw} A ${r} ${r}, 0, ${sweep}, 1, ${x} ${y}`;

    // Render arc as <path> element
    return (
      <path d={path}
        stroke={this.props.stroke}
        strokeWidth={this.props.strokeWidth + 'px'}
        strokeLinecap="round"
        fill="none" />
    );
  }

  render() {
    const text = this.props.showText ? (
      <p className="score-graph-text" style={this.getTextStyle()}>
        {this.state.label + this.props.unit}
      </p>
    ) : false;

    return (
      <div className="score-graph" data-score={this.props.score} style={this.getDivStyle()}>
        <svg width={this.props.width} height={this.props.width}
          viewBox={`0 0 ${this.props.width} ${this.props.width}`}>
          {this.renderBgCircle()}
          {this.renderValueCircle()}
        </svg>
        {text}
      </div>
    );
  }
}


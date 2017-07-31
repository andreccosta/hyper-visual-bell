exports.decorateConfig = (config) => {
  return Object.assign({}, config, {
    css: `
        ${config.css || ''}
        .bell {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: white;
          opacity: 0.8;
        }
        .bell.hidden {
          display: none;
        }
      `
  });
};

exports.decorateTerm = (Term, { React }) => {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.state = {
        toggle: false
      };

      this._onTerminal = this._onTerminal.bind(this);
    }

    _onTerminal(term) {
      const oldRingBell = term.ringBell;

      term.ringBell = () => {
        oldRingBell.call(term);

        this.setState(prevState => ({ toggle: !prevState.toggle }));

        setTimeout(_ => {
          this.setState(prevState => ({ toggle: !prevState.toggle }));
        }, 100);
      }
    }

    render() {
      const customChildrenBefore = Array.from(this.props.customChildrenBefore || {}).concat(
        React.createElement('div', { className: 'bell ' + (this.state.toggle ? '' : 'hidden') })
      );

      return React.createElement(Term, Object.assign({}, this.props, {
        onTerminal: this._onTerminal,
        customChildrenBefore
      }));
    }
  }
}
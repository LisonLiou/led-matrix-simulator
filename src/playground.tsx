import { h, Component, render } from 'preact';
import LedMatrix from './led/matrix';
import { createStore } from './led/store';
import * as fonts from './led/fonts';

interface State {
  cols?: number;
  rows?: number;
  text?: string;
  color?: string;
  fonts?: string[];
  font?: string;
}

class Playground extends Component<any, State> {
  canvas: HTMLCanvasElement;
  led: LedMatrix;
  
  constructor() {
    super();
    this.state = {
      cols: 32,
      rows: 16,
      text: 'Hello\nThere',
      color: '#5fd3ff',
      fonts: Object.keys(fonts),
      font: 'fivebyfive'
    };
  }

  componentDidMount() {
    this.led = new LedMatrix(this.canvas, {
      x: this.state.cols,
      y: this.state.rows
    });
    this.draw();
  }

  draw() {
    // keep ascii codes 0 - 127 
    const text = this.state.text.replace(/[^\x00-\x7F]/g, '');
    const store = createStore(this.state.cols, this.state.rows);
    store.write(text, (fonts as any)[this.state.font], this.state.color);
    this.led.clear();
    this.led.draw(store.matrix);
  }

  slideChange(e: any, prop: string) {
    this.setState({
      [prop]: parseInt(e.target.value)
    });
    this.led.setNewDimensions(this.state.cols, this.state.rows);
    this.draw();
  }

  propChange(e: any, prop: string) {
    this.setState({
      [prop]: e.target.value
    });
    this.draw();
  }

  render(_: any, { rows, cols, text, color, fonts, font }: State) {
    return (
      <div className="row">
        <div className="column">
          x: {cols}
          <input type="range" min="32" max="64" onInput={e => this.slideChange(e, 'cols')} value={cols.toString()}/><br/>
          y: {rows}
          <input type="range" min="16" max="32" onInput={e => this.slideChange(e, 'rows')} value={rows.toString()}/><br/>
          <textarea value={text} onKeyUp={e => this.propChange(e, 'text')}/><br/>
          <input type="color" value={color} onChange={e => this.propChange(e, 'color')}/><br/>
          {fonts.map(fontName =>
            <label>
              <input
                type="radio"
                value={fontName}
                checked={fontName === font}
                onChange={e => this.propChange(e, 'font')}
                /> {fontName}
            </label> 
          )}
        </div>
        <div className="column column-60">
          <div class="led">
            <canvas ref={canvas => this.canvas = canvas as HTMLCanvasElement}></canvas>
          </div>
        </div>
      </div>
    )
  }
}

export default Playground;

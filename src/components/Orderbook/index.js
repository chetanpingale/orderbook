import React, { Component } from 'react'
import { connect } from 'react-redux'
import { debounce } from 'lodash';

import './Orderbook.css'
import { connectToSocket } from './actions'

class Orderbook extends Component {
  constructor(props) {
    super(props)

    this.midpointRef = React.createRef()
    this.renderHeaderBottom = debounce(this.renderHeaderBottom, 100, { leading: true, maxWait: 100 })
    this.renderOrdersContainer = debounce(this.renderOrdersContainer, 100, { leading: true, maxWait: 100 })

    this.state = {
      hasScrolled: false,
      showBook:0,
      selectedStrokeColor: '#0090BC',
      strokeColor: '#717782'
    }
  }

  componentDidMount() {
    this.props.connectToSocket()
  }

  componentWillReceiveProps(props) {
    if(!this.state.hasScrolled) {
      if (this.props.asks.length > 0 && this.props.bids.length > 0) {
        if(this.midpointRef.current) {
          this.midpointRef.current.scrollIntoView({block: 'center'})
          this.setState({ hasScrolled: true })
        }
      }
    }
  }

  renderOrders(orders) {
    return (
      <div>
        {orders.map((order, index) => (
          <div className="Orderbook__book__item" key={index}>
            <div className="columns">
              <div className="column">
              <span className="price">{parseFloat(order['limit_price']).toFixed(2)}</span>
              </div>
              <div className="column">
                {parseFloat(order['size'])}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  renderOrdersMidpoint() {
    return (
      <div id="midpointPrice" ref={this.midpointRef} className="Orderbook__book__item">
        <div className="columns">
          <div className="column">
            Midpoint Price:
          </div>
          <div className="column">
            <span className="price">{'-'}</span> <span className="percentage">{'-'}</span>
          </div>
        </div>
      </div>
    )
  }

  calcPriceChange() {
    const perc = ( this.props.price / this.props.open ) - 1;
    const className = perc >= 0 ? 'color-green' : 'color-red';
    const prefix = perc >= 0 ? '+' : '';
    return <span className={className}>{prefix}{(perc * 100).toFixed(2)}&#37;</span>;
  }

  renderOrdersContainer(order) {
    const {showBook} = this.state
    if (this.props.hasErrored) {
      return <div className="error--">Sorry! There was an error loading the items</div>
    }

    if (!this.props.hasFetched || this.props.isLoading) {
      return <div className="loading--">Loading…</div>
    }
    return (
      <div>
        {(showBook % 3===1 || showBook% 3===0) && <div className="asks">
          {this.renderOrders(this.limitOrders(this.props.asks, 50).reverse())}
        </div>}
        {this.renderOrdersMidpoint()}
        {(showBook % 3===2 || showBook% 3===0) && <div className="bids">
            {this.renderOrders(this.limitOrders(this.props.bids, 50))}
          </div>}
      </div>
    )
  }

  limitOrders(orders, amount) {
    return [...orders.slice(0, amount)]
  }

  renderHeaderBottom() {
    if (this.props.hasErrored) {
      return <div className="error--">Sorry! There was an error loading the items</div>
    }
    if (!this.props.hasFetched || this.props.isLoading || !this.props.price) {
      return <div className="loading--">Loading…</div>
    }
    return (
      <div>
        <span className="bold">{this.props.price} USD</span> <span className="help-text">Last trade price</span>
        <span className="bold">{this.calcPriceChange()}</span> <span className="help-text">24h price</span>
        <span className="bold">{this.props.volume} ETH</span> <span className="help-text">24h volume</span>
      </div>
    )
  }

  render() {
    const { selectedStrokeColor, strokeColor, showBook} = this.state;
    return (
      <div className="Orderbook">
        <header className="Orderbook__header">
          <div className="Orderbook__header__top">
            <span className="heading">Ethereum (ETH)</span>
          </div>
          <div className="Orderbook__header__bottom">
            {this.renderHeaderBottom()}
          </div>
        </header>
        <div className="Orderbook__book">
          <div className="Orderbook__book__header">
            <span className="heading">Order Book</span>
          </div>


          <div className='button-div'>
               <span className="book-icon" onClick={()=>this.setState({showBook: 0})}>
                  <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg"
                       xlink="http://www.w3.org/1999/xlink">
                     <desc>Created with Sketch.</desc>
                     <defs></defs>
                     <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Second-Header" transform="translate(-855.000000, -134.000000)" fill-rule="nonzero">
                           <g id="Group-4" transform="translate(856.000000, 135.000000)">
                              <rect id="Rectangle-10" stroke={showBook === 0 ? selectedStrokeColor: strokeColor} x="0" y="0" width="16" height="16"></rect>
                              <rect id="Rectangle-2" fill="#D75750" x="2" y="3" width="12" height="1"></rect>
                              <rect id="Rectangle-2-Copy" fill="#D75750" x="2" y="6" width="12" height="1"></rect>
                              <rect id="Rectangle-2-Copy-3" fill="#55B987" x="2" y="9" width="12" height="1"></rect>
                              <rect id="Rectangle-2-Copy-4" fill="#55B987" x="2" y="12" width="12" height="1"></rect>
                           </g>
                        </g>
                     </g>
                  </svg>
               </span>
              <span className="book-icon" onClick={()=>this.setState({showBook: 2})}>
                  <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg"
                       xlink="http://www.w3.org/1999/xlink">
                     <desc>Created with Sketch.</desc>
                     <defs></defs>
                     <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Second-Header" transform="translate(-885.000000, -134.000000)" fill-rule="nonzero">
                           <g id="Group-4-Copy" transform="translate(886.000000, 135.000000)">
                              <rect id="Rectangle-10" stroke={showBook === 2 ? selectedStrokeColor: strokeColor} x="0" y="0" width="16" height="16"></rect>
                              <rect id="Rectangle-2" fill="#55B987" x="2" y="3" width="12" height="1"></rect>
                              <rect id="Rectangle-2-Copy" fill="#55B987" x="2" y="6" width="12" height="1"></rect>
                              <rect id="Rectangle-2-Copy-3" fill="#55B987" x="2" y="9" width="12" height="1"></rect>
                              <rect id="Rectangle-2-Copy-4" fill="#55B987" x="2" y="12" width="12" height="1"></rect>
                           </g>
                        </g>
                     </g>
                  </svg>
               </span>
               <span className="book-icon" onClick={()=>this.setState({showBook: 1})}>
                  <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg"
                       xlink="http://www.w3.org/1999/xlink">
                     <desc>Created with Sketch.</desc>
                     <defs></defs>
                     <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Second-Header" transform="translate(-915.000000, -134.000000)" fill-rule="nonzero">
                           <g id="Group-4-Copy-2" transform="translate(916.000000, 135.000000)">
                              <rect id="Rectangle-10" stroke={showBook === 1 ? selectedStrokeColor: strokeColor} x="0" y="0" width="16" height="16"></rect>
                              <rect id="Rectangle-2" fill="#D75750" x="2" y="3" width="12" height="1"></rect>
                              <rect id="Rectangle-2-Copy" fill="#D75750" x="2" y="6" width="12" height="1"></rect>
                              <rect id="Rectangle-2-Copy-3" fill="#D75750" x="2" y="9" width="12" height="1"></rect>
                              <rect id="Rectangle-2-Copy-4" fill="#D75750" x="2" y="12" width="12" height="1"></rect>
                           </g>
                        </g>
                     </g>
                  </svg>
               </span>
          </div>

          <div className="Orderbook__book__subheader">
            <div className="columns">

              <div className="column">
                <span className="heading">Price (USD)</span>
              </div>
              <div className="column">
                <span className="heading">Market Size</span>
              </div>
            </div>
          </div>
          <div className="Orderbook__book__content">
            <div className="Orderbook__book__content-inner">
              {this.renderOrdersContainer()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.orderbook.isLoading,
    hasErrored: state.orderbook.hasErrored,
    hasFetched: state.orderbook.hasFetched,
    price: state.orderbook.price,
    open: state.orderbook.open,
    volume: state.orderbook.volume,
    asks: state.orderbook.asks,
    bids: state.orderbook.bids
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    connectToSocket: () => dispatch(connectToSocket())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orderbook)

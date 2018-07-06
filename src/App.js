import React, { Component } from 'react';
import {GoogleAPI, GoogleLogin, GoogleLogout, CustomGoogleLogin, CustomGoogleLogout, googleGetBasicProfil, googleGetAuthResponse} from 'react-google-oauth'
import GoogleMapReact from 'google-map-react';
import MAPSTYLES from './map.js';
import './styles.css';

// google map marker
const Marker = ({ text }) => 
    <div className="marker"><span>{text}</span></div>;

// svg polling timer
const StatusSVG = ( { strokeDasharray }) =>             
    <div className="status">
        <div className="chart--donut">
            <svg viewBox="0 0 40 40">
                <circle className="chart--donut--segment" cx="20" cy="20" r="15.91549430918954"></circle>
                <circle className="chart--donut--segment" cx="20" cy="20" r="15.91549430918954" strokeDasharray={ strokeDasharray }></circle>
            </svg>
        </div>
    </div>
    
class App extends Component {
    static defaultProps = {
        // refer to my Medium article for instructions
        // on how to get all these bits.
        keys : {
            viewID : '12345678',
            googleMapAPI: 'YOUR API KEY',
            clientID : 'YOUR CLIENT ID',
            scope: 'https://www.googleapis.com/auth/analytics',
            property: 'emptycan.com'
        },
        polling : {
            interval : 10 //seconds
        }
    }
    constructor(defaultProps) { 
        super(defaultProps);
        this.state = {
            url : 'https://www.googleapis.com/analytics/v3/data/realtime?ids=ga:' + this.props.keys.viewID + '&metrics=rt:activeUsers&dimensions=rt:country,rt:city,rt:latitude,rt:longitude',
            userName : false,
            error : "Login Required",
            pause : false, // if true... app stops polling API
            plot : [],
            stats : [],
            total : 0,
            strokeDasharray : "0 100",
            center : {
                lat: 49.281057,
                lng: -123.107638
            },
            zoom : 2
        };
    }
    
    fetchData = () => {
        let _authResp = googleGetAuthResponse();
        console.log("Obtenir les données!")
        fetch(this.state.url + "&access_token=" + _authResp.accessToken)
            .then(response => response.json())
            .then(result => {
                if (result.error)
                    this.error(result.error.message);
                else //if (result.totalsForAllResults['rt:activeUsers'] > 0)
                    this.shapeData(result);
            })
            .catch(error => console.log('error:', error));
    }
    uniqueArray = (arrArg) => {
        return arrArg.filter((elem, pos, arr) => {
            return arr.indexOf(elem) == pos;
        });
    }
    shapeData = (results) => {
        let _total = results.totalsForAllResults['rt:activeUsers'],
            _incoming = results.rows,
            _plot = [],
            _center = this.state.center,
            _stats =  this.state.stats,
            _error = this.state.error
        
        _incoming = results.rows.map(stat => {
            let _city = (stat[1] != "zz") ? stat[1] + ", " : "",
                _country = stat[0],
                _str = `${_city}${_country}`;
            
            if (stat[2]) {
                _plot.push([`${stat[2]}, ${stat[3]}, ${_city}`]);
                _center = {
                    lat: Number(stat[2]),
                    lng: Number(stat[3])
                };
            }
            return _str;
        })
        
        if (_total > 0) {
            _stats = this.uniqueArray(_stats.concat(_incoming));
            // drop old ones
            _stats.length = 10;
            // remove any previous error messages
            _error = null;
        }

        this.setState({
            stats : (_total > 0) ? _stats : [],
            plot : _plot,
            center : _center,
            total : _total,
            error : _error 
        });
/*

        let objDiv = document.getElementById("app");
        objDiv.scrollTop = objDiv.scrollHeight;
*/
    }
    error = (message) => {
        this.setState({
            error : message,
            pause : true
        })
    }
    poll = () => {
        // polling @ _interval seconds
        let _last = 0,
            _timer = 1,
            _interval = this.props.polling.interval;
        
        let render = (_now) => {
            if(!_last || _now - _last >= _interval * 1000 && !this.state.pause) {
                _last = _now;
                _timer = 1;
                this.fetchData();
            } else {
                _timer++;
                let _perc = (_timer / (60 * _interval) * 100);
                this.updateDisplayTimer(_perc);
            }
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
    handleLogout = () => {
        console.log("logged out")
        window.location.reload();
    }
    handleLogin = (data) => {
        const _user = googleGetBasicProfil();
        this.poll();
        this.setState({
            userName : _user.name,
            error : "Waiting for visitors..."
        })
    }
    updateDisplayTimer = (val) => {
        // messing with SVG for countdown timer
        let _val = Math.floor(val),
            _a = _val,
            _b = 100 - _val;
        
        this.setState({
            strokeDasharray : `${_a} ${_b}`
        })
        
    }
    renderNav = () => {
        let _user = this.state.userName;
        return  (    
            <nav>
                <div>Real-Time &mdash; { this.props.keys.property }</div>
                <GoogleAPI 
                    clientId={this.props.keys.clientID}
                    scope={this.props.keys.scope}
                    prompt="consent"
                    onUpdateSigninStatus={this.handleLogin}
                >
                    <div>
                        { _user && 
                            <span>
                                {_user}
                                <CustomGoogleLogout 
                                    onLogoutSuccess={this.handleLogout} 
                                />
                            </span>
                        }
                        { !_user &&
                            <CustomGoogleLogin />
                        }
                    </div>
                </GoogleAPI>
            </nav>
        )
    }
    renderMap = () => {
        const _center = this.state.center,
            _plot = this.state.plot;
        
        if (_plot) 
            return (
                <div className="map--wrapper">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: this.props.keys.googleMapAPI }}
                        options={{ styles: MAPSTYLES }}
                        defaultCenter={_center}
                        defaultZoom={this.state.zoom}
                        center={_center}
                        zoom={2}
                    >
                    {_plot && _plot.map( (plot, index) => {
                        let pt = plot[0].split(", ");
                        return  <Marker key={`marker-${index}`}
                                    lat={ pt[0] }
                                    lng={ pt[1] }
                                    text={ pt[2] }
                                />
                        }
                    )}
                    </GoogleMapReact>
                </div>
        )
    }
    renderStats = () => {
        if (this.state.total < 1) 
            return
        else 
            return this.state.stats.map((stat, index) =>                     
                <div className="stat" key={`stat-${index}`}>
                    <h1>{stat}</h1>
                </div>
            )
    }
    render() {
        let Status = () => <StatusSVG strokeDasharray={ this.state.strokeDasharray }/>,
            Total = ({ value = this.state.total }) => <div className="total">{value}</div>,
            ErrorMessage = ({ value = this.state.error }) => {
                return value ? <h1>{value}</h1> : null;
            }
        return (
            <div>
                { this.renderNav() }
                { this.renderMap() }
                <Status />
                <Total />
                <main id="app">
                    <section>
                        <ErrorMessage />
                        { this.renderStats() }
                    </section>
                </main>
            </div>
        );
    }
}

export default App;

import React, { Component } from "react";
const { Marker, DirectionsRenderer } = require("react-google-maps");



class DirectionRenderComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            directions: null,
        };

    }

    delayFactor = 0;

    componentDidMount() {
        const startLoc = this.props.order.startLocation.lat + ',' + this.props.order.startLocation.lng;
        const destinationLoc = this.props.order.endLocation.lat + ',' + this.props.order.endLocation.lng;
        this.getDirections(startLoc, destinationLoc);
    }

    //getDirection is the function that initiates the new route
    async getDirections(startLoc, destinationLoc, wayPoints = []) {
        const directionService = new window.google.maps.DirectionsService();
        directionService.route(
            {
                origin: startLoc,
                destination: destinationLoc,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                //after the request now we must deal with our response whether its okay or soethning else
                if (status === window.google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: result,

                    });
                }
                //OVER_QUERY_LIMIT is an error wr get when Sending too fast, too long requests or  too many requests per day
                //to deal with this kind of an error we chose to resend he same request but reduce the interval between requests
                //thats why each time we have this error we will increase the delayFactor
                else if (
                    status === window.google.maps.DirectionsStatus.OVER_QUERY_LIMIT
                ) {
                    this.delayFactor++;
                    if (this.delayFactor <= 10) this.delayFactor = 0.2;
                    setTimeout(() => {
                        this.getDirections(startLoc, destinationLoc, wayPoints);
                    }, this.delayFactor * 1000);
                }
                else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }


    destinationClicked = (o) => {
        this.props.clickedOrder(o)
    }
    componentWillReceiveProps(Props, nextProps) {
        console.log('nextProps', nextProps)
        this.setState({
            status: Props.order.status
        })
        if (this.props.order.startLocation && Props !== nextProps) {
            console.log('redoing the routes')
            const startLoc = this.props.order.startLocation.coordinates[1] + ',' + this.props.order.startLocation.coordinates[0];
            const destinationLoc = this.props.order.endLocation.coordinates[1] + ',' + this.props.order.endLocation.coordinates[0];
            this.getDirections(startLoc, destinationLoc);
        }



    }

    render() {
        console.log("rote component rerendered")
        let color = this.state.status === "pending" ? "#FF0000" : "#32CD32"
        console.log(color)
        let originMarker = null;
        let destinationMarker = null;

        originMarker = (
            <Marker


                position={{
                    lat: this.props.order.startLocation.lat,
                    lng: this.props.order.startLocation.lng

                }}
              icon="http://maps.google.com/mapfiles/kml/paddle/go-lv.png"
            />
        );

        destinationMarker = (
            <Marker
                defaultIcon={null}
                position={{
                    lat: this.props.order.endLocation.lat,
                    lng: this.props.order.endLocation.lng
                }}
              icon= 'http://maps.google.com/mapfiles/kml/paddle/red-square-lv.png'
            />
        );

        return (
            <div>
                {originMarker}
                {destinationMarker}
                {this.state.directions && (
                    <DirectionsRenderer
                        directions={this.state.directions}
                        options={{
                            polylineOptions: {
                                strokeColor: color
                            },
                            preserveViewport: this.props.viewport,
                            suppressMarkers: true,
                            icon: { scale: 3 }

                        }}
                    />
                )}
            </div>
        );
    }
}






export default DirectionRenderComponent;




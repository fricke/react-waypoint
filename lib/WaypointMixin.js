var Waypoint = require('waypoints');

var WaypointMixin = {
	getInitialState: function() {
		return {
			waypoints: []
		}
	},
	componentDidMount: function() {
		if(!this.getWaypointConfigs) {
			throw new Error("react-waypoint requires you to defined getWaypointConfigs.  Missing in '%s'", this.displayName);
		}
		var waypoints = [];
		var waypointConfigs = this.getWaypointConfigs();
		var length = waypointConfigs.length;
		var addWaypoint = function(el, handler, offset) {
			var waypoint = new Waypoint({
				element: el,
				handler: handler,
				offset: offset
			});
			waypoints.push(waypoint);
		}
		for(var i=0; i < length; i++) {
			var waypointConfig = waypointConfigs[i];
			var refs = waypointConfig.refs;
			var elementId = waypointConfig.elementId;
			var handler = waypointConfig.handler;
			if(!handler) throw new Error("waypoint#handler required");

			if(refs && refs.length) {
				for(var x=0; x < refs.length; x++) {
					var ref = refs[x];
					var el = this.refs[ref].getDOMNode();
					if(!el) throw new Error("Unable to attach waypoint to %o, %s", waypoint, ref);
					addWaypoint(el, handler, waypoint.offset);
				}
			} else if(elementId) {
				var el = document.getElementByid(elementId);
				addWaypoint(el, handler, waypoint.offset);
			}
		}
		this.setState({
			waypoints: waypoints
		});
	},
	componentWillUnmount: function() {
		var waypoints = this.state.waypoints;
		var length = waypoints.length;
		for(var i=0; i < length; i++) {
			waypoints[i].destroy();
		}
	}
};


module.exports = WaypointMixin;
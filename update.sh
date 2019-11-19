#!/bin/bash
chmod +x parseoui.awk
rm out.txt
wget http://standards.ieee.org/develop/regauth/oui/oui.txt
./parseoui.awk oui.txt | tr -d '\r\t' > oui.json

{
cat  << EOF
(function() {

var ouis = 
EOF

cat oui.json


cat  << EOF
;

var o = {};

// abbreviate 
Object.keys(ouis).forEach(function(key) {
    //console.log(key + ":" + oui[key].toLowerCase().replace(/:/g, '-'));
    o[key.toLowerCase()] = ouis[key].substring(0,8);
});

/* ... for node.js
module.exports = {
  ouis: function() {

    return o;
  },
*/

// macWithManu: function(mac) {
this.macWithManu = function(mac) {
    //if (17 === mac.length && (mac.match(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/))) {
    if (mac.match(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)) {
        mac = mac.replace(/:/g, '-');
        var nibble2 = parseInt(mac.substring(1,2), 16);
        var manu;

        manu = o[mac.substring(0,8)];
        if (!manu) {
            if (0x2 & nibble2) {
                manu = "RANDOM"; // technically LOCAL
            } else if (0x1 & nibble2) {
                manu = "MCAST"; // technically LOCAL
        // let's try removing the bit and looking up again
        mac = mac[0] + (mac[1] & ~0x1) + mac.substr(2, mac.length);
            manu = o[mac.substring(0,8)];
        if (manu) {
                    manu = "#" + manu; // start with special char to show mcast bit was set
        } else {
                    manu = "MCAST";
        }
            } else {
                manu = "UNKNOWN";
            }
        }

        if (manu) {
            mac = manu + mac.substring(8);
        }
    }

    return mac;
}

})();
EOF
} > oui.js

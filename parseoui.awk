#!/usr/bin/awk -f
# Parse IEEE OUI vendor list to JSON
# http://standards.ieee.org/develop/regauth/oui/oui.txt
# ---
# Usage:
#   $ chmod +x parseoui.awk
#   $ wget http://standards.ieee.org/develop/regauth/oui/oui.txt
#   $ ./parseoui.awk oui.txt | tr -d '\r\t' > oui.json

BEGIN {
    # print "[";
    print "{";
}

/(hex)/ {
   # printf "{ \"oui\": \"%s\", \"vendor\": \"%s\"},\n", $1, substr($0, index($0, $3));
   printf "    \"%s\" : \"%s\",\n", $1, substr($0, index($0, $3));
}
END {
   # too lazy to mess with commas, so just add fake entry at end
   print "    \"ff-ff-ff\" : \"broadcast\"\n";

    # print "]";
    print "}";
}

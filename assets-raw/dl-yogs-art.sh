#!/bin/bash

set -e
cd "$(dirname -- "$0")"

DIR_OUTPUT="$(readlink -f "../www/game/assets/yogs-art")"
mkdir -p "$DIR_OUTPUT"

mkdir -p yogs-art
cd yogs-art

dl-ebay-art() {
    echo "$2"
    if [ ! -f "$2.jpg" ]; then
        curl -#Lo "$2.jpg" "https://i.ebayimg.com/images/g/$1/s-l2000.jpg" || true
    fi
    W=$(($3*20))
    H=$(($4*20))
    convert "$2.jpg" \
        -distort Perspective "$5 0,0 $6 $W,0 $7 $W,$H $8 0,$H" \
        -crop "${W}x${H}+0+0" +repage \
        "$DIR_OUTPUT/$2.jpg"
}

# https://www.ebay.co.uk/sch/m.html?LH_Complete=1&_ssn=yogscastltd&_sop=14
# http://archive.fo/3Uqqz

dl-ebay-art "sgsAAOSw4gpbt7bI" lewis_11 24 20 "16,230" "853,304" "865,919" "13,1055" # 20x24, Mouldy Heart
dl-ebay-art "xxEAAOSwDYxbt7oQ" lewis_10 20 16 "146,346" "964,380" "920,1085" "78,1010" # 16x20
dl-ebay-art "PicAAOSwj81bt7f~" lewis_16 20 24 "90,15" "847,139" "865,976" "85,1097" # 20x24, Red Mist
dl-ebay-art "gLwAAOSwTZhbt7r6" lewis_28 16 20 "124,198" "826,160" "897,976" "236,1072" # 16x20
dl-ebay-art "uQwAAOSwYNlbt7s-" lewis_33 16 20 "220,182" "954,304" "876,1161" "117,1178" # 16x20
dl-ebay-art "GiMAAOSwetBbt7hp" lewis_17 24 20 "24,148" "996,220" "1017,951" "21,1025" # 20x24
dl-ebay-art "PIMAAOSwtBZbqSM-" lewis_31 16 20 "46,212" "552,197" "569,841" "60,853" # 16x20
dl-ebay-art "DTIAAOSw-L5bt7kq" lewis_7 24 20 "0,174" "920,267" "930,956" "0,1037" # 20x24, Bladerunner
dl-ebay-art "x9MAAOSwzSdbt7uU" lewis_34 16 20 "123,171" "862,261" "874,1077" "117,1200" # 16x20
dl-ebay-art "hn8AAOSwLZBbqSG9" lewis_22 16 20 "40,190" "616,182" "630,875" "80,906" # 16x20
dl-ebay-art "SJIAAOSwQqJbqSCY" lewis_20 16 20 "62,172" "628,114" "716,790" "184,894" # 16x20
dl-ebay-art "4nQAAOSwjCVbqSJv" lewis_26 16 20 "0,172" "615,176" "658,864" "69,939" # 16x20
dl-ebay-art "izYAAOSweopbp6fs" lewis_27 16 20 "0,276" "563,266" "604,905" "80,1002" # 16x20
dl-ebay-art "rdgAAOSwy6lbp6jQ" lewis_15 16 20 "16,248" "654,268" "657,1006" "41,1062" # 16x20
dl-ebay-art "COoAAOSwQT5bnA8V" booby_mermaid 10 12 "364,128" "1062,144" "1153,1071" "375,1085" # 10x12, Booby Mermaid
dl-ebay-art "c30AAOSwtbxbp6bt" lewis_14 16 20 "89,56" "662,142" "613,824" "64,825" # 16x20
dl-ebay-art "dLcAAOSwHb9bpUJw" lewis_12 16 20 "28,210" "442,196" "482,654" "92,732" # 16x20
dl-ebay-art "XkkAAOSw899bnAvT" dope_asaurus 40 30 "0,0" "1600,0" "1600,1200" "0,1200" # 40x30, Dope-asaurus
dl-ebay-art "jzUAAOSwKfFbnA1C" ttt_bee_king 10 12 "1463,83" "1448,1128" "242,1103" "225,108" # 10x12, TTT Bee King
dl-ebay-art "vxwAAOSwb2JbnAlV" brontosaurmus 40 30 "0,0" "1600,0" "1600,1200" "0,1200" # 40x30, Brontosaurmus

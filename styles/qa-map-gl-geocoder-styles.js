import '@polymer/polymer/polymer-element.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `
<dom-module id="qa-map-gl-geocoder-styles">
  <template>
    <style>
        /* Basics */
        .mapboxgl-ctrl-geocoder,
        .mapboxgl-ctrl-geocoder *,
        .mapboxgl-ctrl-geocoder *:after,
        .mapboxgl-ctrl-geocoder *:before {
        -webkit-box-sizing:border-box;
            -moz-box-sizing:border-box;
                box-sizing:border-box;
        }
        .mapboxgl-ctrl-geocoder {
        font:15px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
        position:relative;
        background-color:white;
        width:33.3333%;
        min-width:240px;
        max-width:360px;
        z-index:1;
        border-radius:3px;
        }

        .mapboxgl-ctrl-geocoder input[type='text'] {
            font-size:12px;
            width:100%;
            border:0;
            background-color:transparent;
            height:40px;
            margin:0;
            color:rgba(0,0,0,.5);
            padding:10px 10px 10px 40px;
            text-overflow:ellipsis;
            white-space:nowrap;
            overflow:hidden;
        }
        .mapboxgl-ctrl-geocoder input:focus {
            color:rgba(0,0,0,.75);
            outline:0;
            box-shadow:none;
            outline:thin dotted\8;
            }

        .mapboxgl-ctrl-geocoder .geocoder-icon-search {
        position:absolute;
        top:10px;
        left:10px;
        }
        .mapboxgl-ctrl-geocoder button {
        padding:0;
        margin:0;
        background-color:#fff;
        border:none;
        cursor:pointer;
        }
        .mapboxgl-ctrl-geocoder .geocoder-pin-right * {
        background-color:#fff;
        z-index:2;
        position:absolute;
        right:10px;
        top:10px;
        display:none;
        }

        .mapboxgl-ctrl-geocoder,
        .mapboxgl-ctrl-geocoder ul {
        box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
        }

        /* Suggestions */
        .mapboxgl-ctrl-geocoder ul {
        background-color:#fff;
        border-radius: 0 0 3px 3px;
        left:0;
        list-style:none;
        margin:0;
        padding:0;
        position:absolute;
        width:100%;
        top:100%;
        z-index:1000;
        overflow:hidden;
        font-size:12px;
        }
        .mapboxgl-ctrl-bottom-left .mapboxgl-ctrl-geocoder ul,
        .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-geocoder ul {
            top:auto;
            bottom:100%;
            }
        .mapboxgl-ctrl-geocoder ul > li > a {
            clear:both;
            cursor:default;
            display:block;
            padding:5px 10px;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            border-bottom:1px solid rgba(0,0,0,0.1);
            color:#404040;
            }
            .mapboxgl-ctrl-geocoder ul > li:last-child > a { border-bottom:none; }
            .mapboxgl-ctrl-geocoder ul > li > a:hover {
            color:#202020;
            background-color:#f3f3f3;
            text-decoration:none;
            cursor:pointer;
            }
            .mapboxgl-ctrl-geocoder ul > li.active > a {
            color:#202020;
            background-color:#e3e3e3;
            text-decoration:none;
            cursor:pointer;
            }

        @-webkit-keyframes rotate { from { -webkit-transform: rotate(0deg); } to { -webkit-transform: rotate(360deg); } }
        @-moz-keyframes rotate { from { -moz-transform: rotate(0deg); } to { -moz-transform: rotate(360deg); } }
            @-ms-keyframes rotate { from { -ms-transform: rotate(0deg); } to { -ms-transform: rotate(360deg); } }
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* icons */
        .geocoder-icon {
        display:inline-block;
        width:20px;
        height:20px;
        vertical-align:middle;
        speak:none;
        background-repeat:no-repeat;
        }
        .geocoder-icon-search {
            background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmVyc2lvbj0iMS4xIj4NCiAgPHBhdGggZD0iTTguNSA0QzYgNCA0IDYgNCA4LjUgNCAxMSA2IDEzIDguNSAxMyA5LjQgMTMgMTAuMiAxMi44IDEwLjggMTIuM0wxMC45IDEyLjMgMTQuMyAxNS43QzE0LjUgMTUuOSAxNC43IDE2IDE1IDE2IDE1LjYgMTYgMTYgMTUuNiAxNiAxNSAxNiAxNC43IDE1LjkgMTQuNSAxNS43IDE0LjNMMTIuMyAxMC45IDEyLjMgMTAuOEMxMi44IDEwLjIgMTMgOS40IDEzIDguNSAxMyA2IDExIDQgOC41IDR6TTguNSA1LjVDMTAuMiA1LjUgMTEuNSA2LjggMTEuNSA4LjUgMTEuNSAxMC4yIDEwLjIgMTEuNSA4LjUgMTEuNSA2LjggMTEuNSA1LjUgMTAuMiA1LjUgOC41IDUuNSA2LjggNi44IDUuNSA4LjUgNS41eiIgZmlsbD0iIzAwMCIvPg0KPC9zdmc+);
            }
        .geocoder-icon-close {
            background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgdmVyc2lvbj0iMS4xIiBoZWlnaHQ9IjIwIiB3aWR0aD0iMjAiPg0KICA8cGF0aCBkPSJtNSA1IDAgMS41IDMuNSAzLjUtMy41IDMuNSAwIDEuNSAxLjUgMCAzLjUtMy41IDMuNSAzLjUgMS41IDAgMC0xLjUtMy41LTMuNSAzLjUtMy41IDAtMS41LTEuNSAwLTMuNSAzLjUtMy41LTMuNS0xLjUgMHoiIGZpbGw9IiMwMDAiLz4NCjwvc3ZnPg==);
            }
        .geocoder-icon-loading {
            background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxwYXRoIGQ9Im0xMCAyIDAgMy4zYzIuNiAwIDQuNyAyLjEgNC43IDQuN2wzLjMgMGMwLTQuNC0zLjYtOC04LTh6IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTEwIDJDNi44IDIgMy43IDQuMSAyLjYgNy4xIDEuNCAxMCAyLjEgMTMuNiA0LjUgMTUuOGMyLjQgMi40IDYuNCAyLjkgOS40IDEuMiAyLjUtMS40IDQuMi00LjIgNC4yLTctMS4xIDAtMi4yIDAtMy4zIDAgMC4xIDIuMi0xLjcgNC4zLTMuOCA0LjZDOC43IDE1IDYuNCAxMy44IDUuNyAxMS43IDQuOCA5LjcgNS42IDcuMSA3LjYgNiA4LjMgNS42IDkuMSA1LjMgMTAgNS4zYzAtMS4xIDAtMi4yIDAtMy4zeiIgc3R5bGU9ImZpbGw6IzAwMDtvcGFjaXR5OjAuMiIvPjwvc3ZnPg==);
            -webkit-animation: rotate 400ms linear infinite;
            -moz-animation: rotate 400ms linear infinite;
                -ms-animation: rotate 400ms linear infinite;
                    animation: rotate 400ms linear infinite;
            }


    </style>
  </template>
</dom-module>
`;
document.head.appendChild($_documentContainer.content);
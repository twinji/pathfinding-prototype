var canvas, c;

function choose(array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];
}

function calculateNodeDistance(nodeA, nodeB) {
    var diffX = Math.abs(nodeA.x - nodeB.x);
    var diffY = Math.abs(nodeA.y - nodeB.y);
    return Math.min(diffY, diffX) * 14 + Math.abs(diffX - diffY) * 10;
}

function init() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    c = canvas.getContext("2d");
}

function Node(x, y, isObstruction) {
    this.x = x;
    this.y = y;
    this.parentNode = null;
    this.isObstruction = isObstruction;
    this.hCost = 0;
    this.gCost = 0;
    this.fCost = 0;
    this.getGCost = function() {
        if (this.parentNode != null) {
            return calculateNodeDistance(this.parentNode, this) + this.parentNode.getGCost();
        } else {
            return 0;
        }
    }
}

function NodeManager() {
    this.nodes = new Array();
    this.targetNode = null;
    this.startingNode = null;
    this.openNodes = new Array();
    this.closedNodes = new Array();
    this.add = function(node) {
        this.nodes.push(node);
    }
    this.createNodeGrid = function(numOfHorizontalNodes, numOfVerticalNodes) {
        for (var h = 0; h < numOfHorizontalNodes; h++) {
            for (var v = 0; v < numOfVerticalNodes; v++) {
                this.add(new Node(h, v, false));
            }
        }
    };
    this.setTargetNode = function(x, y) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].x == x && this.nodes[i].y == y) {
                this.targetNode = this.nodes[i];
                return;
            }
        }
    };
    this.setStartingNode = function(x, y) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].x == x && this.nodes[i].y == y) {
                this.startingNode = this.nodes[i];
                return;
            }
        }
    };
    this.setObstructionNode = function(x, y, obstruction) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].x == x && this.nodes[i].y == y) {
                if (this.nodes[i] != this.startingNode && this.nodes[i] != this.targetNode) {
                    this.nodes[i].isObstruction = obstruction;
                    return;
                }
            }
        }
    };
    this.getNode = function(x, y) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].x == x && this.nodes[i].y == y) {
                return this.nodes[i];
            }
        }
    };
    this.findPath = function() {
        if (this.startingNode != null && this.targetNode != null) {
            this.openNodes = new Array();
            this.closedNodes = new Array();

            this.openNodes.push(this.startingNode);

            while (true) {
                this.openNodes.sort(function(a, b) {
                    return a.fCost - b.fCost;
                });
                var currentNode = this.openNodes[0];

                var index = this.openNodes.indexOf(currentNode);
                if (index != -1) {
                    this.openNodes.splice(index, 1);
                }
                this.closedNodes.push(currentNode);

                if (currentNode == this.targetNode) {
                    break;
                }

                var neighboringNodes = new Array();

                for (var i = -1; i <= 1; i += 2) {
                    neighboringNodes.push(this.getNode(currentNode.x + i, currentNode.y));
                    neighboringNodes.push(this.getNode(currentNode.x, currentNode.y + i));
                    neighboringNodes.push(this.getNode(currentNode.x + i, currentNode.y - i));
                    neighboringNodes.push(this.getNode(currentNode.x - i, currentNode.y + i));
                }
                for (var n = 0; n < neighboringNodes.length; n++) {
                    console.log(neighboringNodes);

                    if (neighboringNodes[n] == undefined) {
                        continue;
                    } else if (neighboringNodes[n].isObstruction || this.closedNodes.indexOf(neighboringNodes[n]) != -1) {
                        continue;
                    }

                    var hCostTemp = calculateNodeDistance(neighboringNodes[n], this.targetNode);
                    var gCostTemp = neighboringNodes[n].getGCost();
                    var fCostTemp = hCostTemp + gCostTemp;

                    if (fCostTemp < neighboringNodes[n].fCost || this.openNodes.indexOf(neighboringNodes[n]) == -1) {
                        neighboringNodes[n].fCost = fCostTemp;
                        this.openNodes.push(neighboringNodes[n]);
                        neighboringNodes[n].parentNode = currentNode;
                        if (this.openNodes.indexOf(neighboringNodes[n]) == -1) {
                            this.openNodes.push(neighboringNodes[n]);
                        }
                    }
                }
            }
            console.log("Found target!");
        }
    };
    this.renderNodeGrid = function(nodeWidth, nodeHeight, c) {
        for (var i = 0; i < this.nodes.length; i++) {
            var color = "white";

            if (this.openNodes.indexOf(this.nodes[i]) != -1) {
                color = "yellow";
            }
            if (this.closedNodes.indexOf(this.nodes[i]) != -1) {
                color = "crimson";
            }
            if (this.nodes[i].isObstruction) {
                continue;
            }
            if (this.startingNode == this.nodes[i]) {
                color = "lime";
            }
            if (this.targetNode == this.nodes[i]) {
                color = "blue";
            }
            c.fillStyle = color;
            c.fillRect(this.nodes[i].x * (nodeWidth + 1), this.nodes[i].y * (nodeHeight + 1), nodeWidth, nodeHeight);
        }
    };
}



function main() {
    init();

    var nm = new NodeManager();

    nm.createNodeGrid(10, 10);
    nm.setStartingNode(1, 9);
    nm.setTargetNode(9, 8);

    nm.setObstructionNode(5, 0, true);
    nm.setObstructionNode(5, 1, true);
    nm.setObstructionNode(5, 2, true);
    nm.setObstructionNode(3, 3, true);
    nm.setObstructionNode(5, 2, true);
    nm.setObstructionNode(5, 7, true);
    nm.setObstructionNode(5, 8, true);

    nm.setObstructionNode(2, 0, true);
    nm.setObstructionNode(1, 1, true);
    nm.setObstructionNode(5, 2, true);
    nm.setObstructionNode(2, 3, true);
    nm.setObstructionNode(2, 4, true);
    nm.setObstructionNode(2, 9, true);
    nm.setObstructionNode(2, 8, true);

    nm.setObstructionNode(9, 4, true);
    nm.setObstructionNode(8, 9, true);
    nm.setObstructionNode(6, 8, true);

    nm.findPath();

    nm.renderNodeGrid(70, 70, c);
}

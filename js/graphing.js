var TreeData = [];
var flag = 0;

function GetData() {
    document.getElementById('show-tree').innerHTML = '';
    var text = document.getElementById("input-text").value;
    var mul_data = text.split("\n\n");
    var h = 0;
    var hide = [];
    var count_tree = 0;
    for (var i = 0; i < mul_data.length; i++) {
        count_tree++;
        var pic_data = mul_data[i].split("\n"); 
        var line = 0;
        for (var j = 0; j < pic_data.length; j++) {
            var per_data = pic_data[j].split("："); 
            var per_front = per_data[0];
            var per_back = per_data[1];
            if (per_front == "导师") {
                var teacher = {
                    "name": per_back,
                    "parent": null,
                    "children": []
                }
                TreeData[i] = teacher;
            } else if(per_front.search("博士生") >= 0 || per_front.search("硕士生") >= 0 || per_front.search("本科生") >= 0) {
                var grade = {
                    "name": per_front,
                    "parent": null,
                    "children": []
                }
                TreeData[i].children[line] = grade;
                var per_name = per_back.split("、"); 
                for (var k = 0; k < per_name.length; k++) {
                    var name = {
                        "name": per_name[k],
                        "parent": null,
                        "children": []
                    }
                    TreeData[i].children[line].children[k] = name;
                }
                line ++;
            } else {
                var identity_name = {
                    "name": per_front,
                    "parent": null,
                    "children": []
                }
                TreeData[i] = identity_name;
                var per_identity = per_back.split("、"); 
                for (var k = 0; k < per_identity.length; k++) {
                    var identity = {
                        "name": per_identity[k],
                        "parent": null,
                        "children": []
                    }
                    TreeData[i].children[k] = identity;
                }
                //check
                for (n = 0; n < i; n++) {
                    check(TreeData[n], TreeData[i].name, TreeData[i], n);
                }
                if (flag) {
                    TreeData[i] = [];
                    hide[h] = i;
                    h++;
                }
                
            }
        }

    }
    var flag_hide = 0;
    //alert(count_tree);
    for (i = 0; i < count_tree; i++) {
        for(j = 0; j < h; j ++){
            if(hide[j] == i) {
                flag_hide = 1;
            }
        }
        if(!flag_hide) MakeTreeGraph(i);
        flag_hide = 0;
    }
    
}

function check(tree, name, node, k) {
    var length = 0;
    for (var i in tree.children) {
        length++;
    }
    for (var i = 0; i < length; i++) {
        if (tree.children[i].name == name) {
            flag = 1;
            tree.children[i] = node; 
            return 1;
        } else {
            check(tree.children[i], name, node, k);
        }
    }
    return 0;
}

function MakeTreeGraph(k) {
    var margin = {
            top: 20,
            right: 120,
            bottom: 20,
            left: 120
        },
        width = 1000 - margin.right - margin.left,
        height = 960 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    var svg = d3.select("#show-tree")
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = TreeData[k];
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);

    d3.select(self.frameElement).style("height", "500px");

    function update(source) {
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        nodes.forEach(function(d) {
            d.y = d.depth * 180;
        });

        var node = svg.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        var nodeEnter = node.enter().append("g") 
            .attr("class", "node") 
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", click);

        nodeEnter.append("rect")
            .attr("x", -35)
            .attr("y", -22)
            .attr("width", 100)
            .attr("height", 25)
            .attr("rx", 10)
            .style("fill", "#5698c3"); 

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? 13 : 13;
            })
            .attr("dy", "-4")
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name;
            })
            .style("fill", "white")
            .style("fill-opacity", 1e-6);

        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        nodeUpdate.select("rect")
            .attr("x", -35)
            .attr("y", -22)
            .attr("width", 100)
            .attr("height", 25)
            .attr("rx", 10)
            .style("fill", "#5698c3");

        nodeUpdate.select("text")
            .attr("text-anchor", "middle")
            .style("fill-opacity", 1);

        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("rect")
            .attr("x", -35)
            .attr("y", -22)
            .attr("width", 100)
            .attr("height", 25)
            .attr("rx", 10)
            .style("fill", "#5698c3");

        nodeExit.select("text")
            .attr("text-anchor", "middle")
            .style("fill-opacity", 1e-6);

        var link = svg.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .attr('marker-end', 'url(#arrow)');

        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}
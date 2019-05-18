import { Vertex } from './Graph2';
import { Graph } from './Graph2';
import { prototype } from 'stream';

export class ExtractedGraph<T> {
    g: number[][];
    extractedG: number[][];
    visited: boolean[];
    sortedIndices: number[];
    ind2nodes: Vertex<T>[] = [];
    nodes2ind: Map<Vertex<T>, number> = new Map();

    parentVisited: boolean[];
    childVisited: boolean[];

    constructor(graph: Graph<T>) {
        let num = 0;
        for (const key of graph.keys()) {
            this.ind2nodes.push(key);
            num++;
        }
        // this.g = new Array(num).fill(Array(num));
        this.g = Array.from({ length: num }, (x, i) => Array.from({ length: num }, (x, i) => 0));
        this.extractedG = Array.from({ length: num }, (x, i) =>
            Array.from({ length: num }, (x, i) => 0)
        );
        this.visited = new Array(num).fill(false);
        this.parentVisited = new Array(num).fill(false);
        this.childVisited = new Array(num).fill(false);
        for (let i = 0; i < num; i++) {
            this.nodes2ind.set(this.ind2nodes[i], i);
        }
        for (let i = 0; i < num; i++) {
            const curNode = this.ind2nodes[i];
            const adjNodes = graph.get(curNode);
            if (!adjNodes) {
                continue;
            }

            for (let j = 0; j < num; j++) {
                if (!(this.ind2nodes[j].val as any).conflict(curNode.val)) {
                    continue;
                }
                // const index = this.nodes2ind.get(adjNodes[j]);
                // if (!index) continue;
                if (i !== j) {
                    // console.log(
                    //     this.ind2nodes[i].val.section.key + ' ' + this.ind2nodes[j].val.section.key
                    // );
                    this.g[i][j] = 1;
                }
            }
        }

        const indices = Array.from({ length: num }, (x, i) => i);
        for (let i = 0; i < num; i++) {
            let maxPriority = indices[i];
            let idx = i;
            for (let j = i + 1; j < num; j++) {
                if (this.calcPriority(maxPriority) < this.calcPriority(indices[j])) {
                    maxPriority = indices[j];
                    idx = j;
                }
            }
            const temp = indices[i];
            indices[i] = indices[idx];
            indices[idx] = temp;
        }
        // console.log('max priority ' + this.ind2nodes[indices[0]].val.section.key);
        this.sortedIndices = indices;
        this.extractGraph();
        for (let i = 0; i < num; i++) {
            this.constructPaths(i, true);
            this.constructPaths(i, false);
        }
        console.log(this.g);
        console.log(this.extractedG);
    }

    calcPriority(n: number) {
        return this.g[n].reduce((a, x) => a + x);
    }

    extractGraph() {
        for (const i of this.sortedIndices) {
            // console.log(i + ' ' + this.ind2nodes[i].val.section.key);
            this.DFS(i);
        }
    }

    DFS(node: number) {
        const children = this.g[node];
        const indices = this.sortedIndices;
        for (const index of indices) {
            // console.log(node + ' ' + index);
            if (!this.visited[index] && this.g[node][index] !== 0 && node !== index) {
                // // find node's father
                // const parent = [];
                // for (let i = 0; i < this.g[node].length; i++) {
                //     if (this.g[i][node] !== 0) parent.push(i);
                // }

                // let cfl = false; // no conflict
                // if (parent.length !== 0) {
                //     for (const idx in parent) {
                //         for (let i = 0; i < this.g[index].length; i++) {
                //             if (this.g[index][i] !== 0 && parent.indexOf(i) !== -1) {
                //                 cfl = true;
                //             }
                //         }
                //     }
                // }

                // //node is the father, but if node's father doesn't have conflict with index, then index is the father
                // if (!cfl) {
                //     this.extractedG[node][index] = 1;
                // } else {
                //     this.extractedG[index][node] = 1;
                // }
                this.extractedG[index][node] = 1;
                this.visited[index] = true;
                this.visited[node] = true;
                this.DFS(index);
            }
        }
    }

    constructPaths(n: number, ahead: boolean) {
        // DO NOT DELETE!!!! This is an optimization that not yet finished
        // if (ahead) {
        //     if (this.parentVisited[n]) {
        //         const temp = this.ind2nodes[n].aheadPath.map(vts =>
        //             vts.map(v => this.nodes2ind.get(v))
        //         );
        //         if(temp){
        //             return temp;
        //         }
        //     }
        // }else{

        // }
        const curPath: Vertex<T>[][] = [];

        for (let i = 0; i < this.extractedG[n].length; i++) {
            if (ahead) {
                if (this.extractedG[n][i] === 0) continue;
            } else {
                if (this.extractedG[i][n] === 0) continue;
            }
            const parPath: Vertex<T>[][] = this.constructPaths(i, ahead);

            if (parPath.length === 0) {
                const p = [this.ind2nodes[i]];
                curPath.push(p);
                if (ahead) {
                    this.ind2nodes[n].aheadPath.push(p);
                } else {
                    this.ind2nodes[n].behindPath.push(p);
                }
            }

            for (const p of parPath) {
                const p2 = p.concat();
                p2.unshift(this.ind2nodes[i]);
                curPath.push(p2);
                if (ahead) {
                    this.ind2nodes[n].aheadPath.push(p2);
                } else {
                    this.ind2nodes[n].behindPath.push(p2);
                }
            }
        }
        return curPath;
    }
}

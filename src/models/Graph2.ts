import ScheduleBlock from './ScheduleBlock';

export type Graph<T> = Map<Vertex<T>, Vertex<T>[]>;

export class Vertex<T> {
    val: T;
    visited = false;
    ahead: number = 0;
    behind: number = 0;
    aheadMax: number = 0;
    behindMax: number = 0;
    aheadPath: Vertex<T>[][] = [];
    behindPath: Vertex<T>[][] = [];

    constructor(t: T) {
        this.val = t;
    }
}

/**
 * given a graph, returns a sort function on this graph
 *
 * this function first sorts nodes by their breadth in descending order.
 * If two nodes have the same breadth, then they'll be sorted in
 * descending order according the numerical value returned by their `[Symbol.toPrimitive]` method
 *
 * @see [[ScheduleBlock]]
 * @param graph
 */

function sortFunc<T>(graph: Graph<T>) {
    return (a: Vertex<T>, b: Vertex<T>) => {
        const d1 = graph.get(a)!;
        const d2 = graph.get(b)!;
        const result = d2.length - d1.length;
        if (result) return result;
        else {
            return +b.val - +a.val;
        }
    };
}

// function constructGraph<T>(graph: Graph<T>) {
//     const nodes = Array.from(graph.keys()).sort(sortFunc(graph));
//     let current: Vertex<T> = nodes[0];
//     const queue: Vertex<T>[] = Array();
//     queue.push(current);
//     while (nodes.length !== 0) {
//         current.visited = true;
//         const children = graph.get(current);
//         if (children === undefined) continue;
//         const sortedChildren = Array.from(children.sort(sortFunc(graph)));
//         for (const c of sortedChildren) {
//             if (c.visited) continue;
//             const c_parents: Vertex<T>[] = c.parents;
//             // if(c_parents.find())
//         }
//     }
// }

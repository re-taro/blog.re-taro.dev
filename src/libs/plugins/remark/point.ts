import type { Point } from "unist";

export function addColumn(point: Point, column: number): Point {
	return {
		column: point.column + column,
		line: point.line,
		offset: point.offset !== undefined ? point.offset + column : undefined,
	};
}

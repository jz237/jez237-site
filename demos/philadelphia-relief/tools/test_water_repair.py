import unittest

from shapely.geometry import shape
from shapely.ops import unary_union

from repair_water import repair


class WaterRepairTest(unittest.TestCase):
    def test_self_intersections_and_duplicate_surfaces(self):
        def feature(ring):
            return {'type': 'Feature', 'properties': {'n': 'test'},
                    'geometry': {'type': 'Polygon', 'coordinates': [ring]}}
        line = {'type': 'Feature', 'properties': {'n': 'river'},
                'geometry': {'type': 'LineString', 'coordinates': [[0, 0], [1, 1]]}}
        document = {'features': [line,
            feature([[0, 0], [2, 2], [0, 2], [2, 0], [0, 0]]),
            feature([[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]])]}
        result = repair(document)
        self.assertEqual(result['features'][0], line)
        geometries = [shape(f['geometry']) for f in result['features'][1:]]
        self.assertTrue(all(g.is_valid for g in geometries))
        self.assertAlmostEqual(sum(g.area for g in geometries), 4)
        self.assertAlmostEqual(unary_union(geometries).area, 4)
        repeated = repair(result)
        self.assertAlmostEqual(sum(shape(f['geometry']).area for f in repeated['features'][1:]), 4)


if __name__ == '__main__':
    unittest.main()

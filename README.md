# CoordinateTransform
火星、百度、WGS84坐标互转，Typescript版本

静态类，import之后直接使用即可

```
import { CoordTransform } from './CoordTransform';

/** BD09 转 GCJ02 */
let gcj02 = CoordTransform.Bd09ToGcj02(120, 35);

/** GCJ02 转 BD09 */
let bd09 = CoordTransform.Gcj02ToBd09(120, 35);

/** WGS84 转 GCJ02 */
let gcj02 = CoordTransform.Ggs84ToGcj02(120, 35);

/** GCJ02 转 WGS84 */
let wgs84 = CoordTransform.Gcj02ToWgs84(120, 35);

 ```

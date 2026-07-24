# 公司法定名称与产品品牌（真源）

> 对外法律文件、版权行、App Store 开发者/卖家名称等须使用**法定名称**；产品 UI、营销文案使用**产品品牌**。

| 用途 | 中文 | English |
|------|------|---------|
| **法定主体全称** | 觉醒意志（杭州）健康科技有限公司 | Awakening Will (hangzhou) Health Technology Co., Ltd |
| **产品 / App 品牌** | Awak Health | Awak Health |
| **智能穿戴统称** | Awak Health 智能穿戴设备 | Awak Health smart wearable devices |

## 禁止混用

- 法定主体英文**不得**写作 `Awak Will (Hangzhou) …`、`Awak Health (Hangzhou) …`、`Awak Will(Hangzhou) …` 或省略 `Awakening`。
- 产品品牌 `Awak Health` **不得**替代法定主体名称出现在：协议运营主体、版权所有、英文隐私政策 Operator 行、公司落款。
- 历史产品品牌 `Awak Will` / `AWAK WILL` 已废止，新文案一律使用 `Awak Health`。

## 工程引用

| 端 | 常量位置 |
|----|----------|
| Flutter App | `apps/mobile/lib/brand/awak_company_identity.dart` |
| 官网 | `website/shared/lib/companyIdentity.ts` |
| 英文法律 Markdown | `website/content/legal/en/*.md`（发布真源）；`docs/Reference/协议/en/*.md`（monorepo 镜像） |

## 修订

变更法定名称须同步：四份协议中英文、`meta.json`、上表常量、App Store Connect 卖家名称。

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- The following new entities are **now** created:

| Resources | Entity `_type`    | Entity `_class` |
| --------- | ----------------- | --------------- |
| CloudWAF  | `sigsci_cloudwaf` | `Firewall`      |

- The following new relationships are **now** created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `sigsci_corp`         | **HAS**               | `sigsci_cloudwaf`     |

## [1.0.0] - 2022-01-25

- Initial release of the Signal Sciences integration. Includes ingestion of
  users and corps (organizations).

# Отчет о нагрузочном тестировании

## Оглавление
0. [Сложности реализации](#сложности-реализации)
1. [Цель тестирования](#цель-тестирования)
2. [Скрипты и их описание](#скрипты-и-их-описание)
3. [Профиль нагрузки](#профиль-нагрузки)
4. [SLA](#sla)
5. [Отчет НТ](#отчет-нт)
6. [Результаты тестирования](#результаты-тестирования)
7. [Анализ и выводы](#анализ-и-выводы)

---

## Сложности реализации
При авторизации с одного ip нескольких аккаунтов сервис просит ввести капчу к одному из них

## Цель тестирования
Продемонстрировать навыки работы с К6

## Скрипты и их описание

| Скрипт  | Описание |
| ------------- | ------------- |
| UC01_createFolder  | Создание папки  |
| UC02_emptyTrash  | Очистка корзины  |
| UC03_sendMessage  | Отправка письма  |

## Профиль нагрузки
| Скрипт  | Интенсивность(оп/ч) |
| ------------- | ------------- |
| UC01_createFolder  | 20  |
| UC02_emptyTrash  | 20  |
| UC03_sendMessage  | 20  |

## SLA
| Скрипт  | Response time |
| ------------- | ------------- |
| UC01_createFolder  | 5s  |
| UC02_emptyTrash  | 5s  |
| UC03_sendMessage  | 5s  |

## Отчет НТ
| Скрипт  | Response time | Утилизация CPU | Конфигурация стенда |
| ------------- | ------------- | ------------- | ------------- |
| UC01_createFolder  | 456ms  | 1%  | 12 cpu, 16 ram  |
| UC02_emptyTrash  | 456ms  | 1%  | 12 cpu, 16 ram  |
| UC03_sendMessage  | 456ms  | 1%  | 12 cpu, 16 ram  |


## Результаты тестирования
![alt text](https://github.com/k0xzy/IPR/blob/master/img/cloud.png)
![alt text](https://github.com/k0xzy/IPR/blob/master/img/mail.png)


## Анализ и выводы
- **Соответствие профилю нагрузки**: удалось достичь целевой нагрузки в 20 операций в час.
- **Времена отклика**: соответствует SLA.
- **Выводы**: При запуске нескольких разных кейсов UC происхдит конфликт токена. Выяснилось, что mail.ru требует ввод капчи. Провел тест с самым нагруженным скриптом UC03_sendMessage, где используются все необходимые виды параметризаций и корреляций.
